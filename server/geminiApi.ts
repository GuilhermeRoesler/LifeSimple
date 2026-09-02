import type { IncomingMessage, ServerResponse } from 'node:http';
import { productNames } from '../src/data/products.ts';
import {
  ADDRESS,
  BUSINESS_HOURS,
  EMAIL,
  PHONE_DISPLAY,
} from '../src/constants/contact.ts';
import {
  MAX_BODY_BYTES,
  validateChatPayload,
} from './chatLimits.ts';
import {
  extractBearerToken,
  getFirebaseProjectId,
  verifyFirebaseIdToken,
} from './firebaseAuth.ts';

type RateBucket = { hits: number[] };

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const buckets = new Map<string, RateBucket>();

function trustProxy(): boolean {
  const value = process.env.TRUST_PROXY?.trim().toLowerCase();
  return value === '1' || value === 'true' || value === 'yes';
}

function getClientIp(req: IncomingMessage): string {
  if (trustProxy()) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0]!.trim();
    }
  }
  return req.socket.remoteAddress ?? 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < RATE_WINDOW_MS);
  if (bucket.hits.length >= RATE_MAX) {
    buckets.set(key, bucket);
    return true;
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  return false;
}

function buildSystemPrompt(): string {
  return `
Você é o assistente virtual da farmácia de manipulados Life Simple. Seu tom deve ser educado, atencioso e claro.

Você pode responder sobre manipulação de medicamentos (sem prescrever), horários, prazos de entrega, formas de pagamento e como solicitar orçamentos. Nunca forneça diagnósticos ou prescreva medicamentos.

Quando não souber responder, oriente o cliente a entrar em contato:
- WhatsApp: ${PHONE_DISPLAY}
- E-mail: ${EMAIL}
- Endereço: ${ADDRESS}
- Horário: ${BUSINESS_HOURS.weekdays}, ${BUSINESS_HOURS.saturday}, ${BUSINESS_HOURS.sunday}

Produtos disponíveis: ${productNames}.

Nunca mencione que é uma IA. Apresente-se como assistente virtual da Life Simple.`.trim();
}

class BodyTooLargeError extends Error {
  constructor() {
    super('BODY_TOO_LARGE');
    this.name = 'BodyTooLargeError';
  }
}

async function readJsonBody(req: IncomingMessage, maxBytes: number): Promise<unknown> {
  const contentLength = req.headers['content-length'];
  if (contentLength) {
    const declared = Number(contentLength);
    if (Number.isFinite(declared) && declared > maxBytes) {
      throw new BodyTooLargeError();
    }
  }

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > maxBytes) {
      throw new BodyTooLargeError();
    }
    chunks.push(buf);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw) as unknown;
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function drainRequest(req: IncomingMessage): void {
  req.resume();
}

export async function handleChatRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    drainRequest(req);
    sendJson(res, 405, { error: 'Método não permitido' });
    return;
  }

  const contentLength = req.headers['content-length'];
  if (contentLength) {
    const declared = Number(contentLength);
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      drainRequest(req);
      sendJson(res, 413, { error: 'Requisição muito grande.' });
      return;
    }
  }

  const ip = getClientIp(req);
  if (isRateLimited(`ip:${ip}`)) {
    drainRequest(req);
    sendJson(res, 429, { error: 'Muitas solicitações. Tente novamente em instantes.' });
    return;
  }

  const projectId = getFirebaseProjectId();
  if (!projectId) {
    drainRequest(req);
    sendJson(res, 503, {
      error: 'Assistente indisponível no momento. Use o WhatsApp para falar conosco.',
    });
    return;
  }

  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    drainRequest(req);
    sendJson(res, 401, { error: 'Autenticação necessária.' });
    return;
  }

  let uid: string;
  try {
    ({ uid } = await verifyFirebaseIdToken(token, projectId));
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    drainRequest(req);
    sendJson(res, 401, { error: 'Sessão inválida ou expirada. Recarregue a página.' });
    return;
  }

  if (isRateLimited(`uid:${uid}`)) {
    drainRequest(req);
    sendJson(res, 429, { error: 'Muitas solicitações. Tente novamente em instantes.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith('YOUR_') || apiKey.includes('SUA_')) {
    drainRequest(req);
    sendJson(res, 503, {
      error: 'Assistente indisponível no momento. Use o WhatsApp para falar conosco.',
    });
    return;
  }

  let rawBody: unknown;
  try {
    rawBody = await readJsonBody(req, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      sendJson(res, 413, { error: 'Requisição muito grande.' });
      return;
    }
    sendJson(res, 400, { error: 'JSON inválido' });
    return;
  }

  const payload = validateChatPayload(rawBody);
  if (!payload.ok) {
    sendJson(res, payload.status, { error: payload.error });
    return;
  }

  const { message, history } = payload;
  const contents = [
    ...history.map((item) => ({
      role: item.role,
      parts: [{ text: item.text }],
    })),
    { role: 'user' as const, parts: [{ text: message }] },
  ];

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text());
      sendJson(res, 502, {
        error: 'Não foi possível obter resposta agora. Tente novamente ou fale pelo WhatsApp.',
      });
      return;
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Desculpe, não consegui processar sua solicitação no momento.';

    sendJson(res, 200, { text });
  } catch (error) {
    console.error('Gemini proxy error:', error);
    sendJson(res, 500, {
      error: 'Erro interno. Tente novamente ou fale pelo WhatsApp.',
    });
  }
}

export function isChatApiPath(url: string | undefined): boolean {
  if (!url) return false;
  const path = url.split('?')[0];
  return path === '/api/chat';
}
