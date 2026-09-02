export const MAX_BODY_BYTES = 16_384;
export const MAX_MESSAGE_CHARS = 2_000;
export const MAX_HISTORY_ITEMS = 12;
export const MAX_HISTORY_ITEM_CHARS = 2_000;

export type ChatHistoryItem = { role: 'user' | 'model'; text: string };

export type ChatPayloadOk = {
  ok: true;
  message: string;
  history: ChatHistoryItem[];
};

export type ChatPayloadErr = {
  ok: false;
  status: number;
  error: string;
};

/** Valida e normaliza message + history após o JSON parse. */
export function validateChatPayload(body: unknown): ChatPayloadOk | ChatPayloadErr {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, error: 'JSON inválido' };
  }

  const record = body as { message?: unknown; history?: unknown };
  if (typeof record.message !== 'string') {
    return { ok: false, status: 400, error: 'Mensagem obrigatória' };
  }

  const message = record.message.trim();
  if (!message) {
    return { ok: false, status: 400, error: 'Mensagem obrigatória' };
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return {
      ok: false,
      status: 413,
      error: `Mensagem muito longa (máx. ${MAX_MESSAGE_CHARS} caracteres).`,
    };
  }

  const rawHistory = Array.isArray(record.history) ? record.history : [];
  const history: ChatHistoryItem[] = [];

  for (const item of rawHistory.slice(-MAX_HISTORY_ITEMS)) {
    if (!item || typeof item !== 'object') continue;
    const row = item as { role?: unknown; text?: unknown };
    if (row.role !== 'user' && row.role !== 'model') continue;
    if (typeof row.text !== 'string' || !row.text.trim()) continue;
    const text = row.text.trim().slice(0, MAX_HISTORY_ITEM_CHARS);
    history.push({ role: row.role, text });
  }

  return { ok: true, message, history };
}
