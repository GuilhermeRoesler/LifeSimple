import type { IncomingMessage, ServerResponse } from 'node:http';
import { productNames } from '../src/data/products.ts';
import {
  ADDRESS,
  BUSINESS_HOURS,
  EMAIL,
  PHONE_DISPLAY,
} from '../src/constants/contact.ts';

type ChatHistoryItem = { role: 'user' | 'model'; text: string };

type RateBucket = { hits: number[]; };

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const buckets = new Map<string, RateBucket>();

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]!.trim();
  }
  return req.socket.remoteAddress ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < RATE_WINDOW_MS);
  if (bucket.hits.length >= RATE_MAX) {
    buckets.set(ip, bucket);
    return true;
  }
  bucket.hits.push(now);
  buckets.set(ip, bucket);
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

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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
    sendJson(res, 405, { error: 'Método não permitido' });
    return;
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    sendJson(res, 429, { error: 'Muitas solicitações. Tente novamente em instantes.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith('YOUR_') || apiKey.includes('SUA_')) {
    sendJson(res, 503, {
      error: 'Assistente indisponível no momento. Use o WhatsApp para falar conosco.',
    });
    return;
  }

  let body: { message?: string; history?: ChatHistoryItem[] };
  try {
    body = (await readJsonBody(req)) as typeof body;
  } catch {
    sendJson(res, 400, { error: 'JSON inválido' });
    return;
  }

  const message = body.message?.trim();
  if (!message) {
    sendJson(res, 400, { error: 'Mensagem obrigatória' });
    return;
  }

  const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
  const contents = [
    ...history
      .filter((item) => item?.text && (item.role === 'user' || item.role === 'model'))
      .map((item) => ({
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
