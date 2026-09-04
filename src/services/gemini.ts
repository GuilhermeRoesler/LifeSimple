export type ChatHistoryItem = {
  role: 'user' | 'model';
  text: string;
};

export type ChatApiRequest = {
  message: string;
  history?: ChatHistoryItem[];
};

export type AskAssistantOptions = {
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
};

async function readErrorMessage(response: Response): Promise<string> {
  let detail = `Erro ${response.status}`;
  try {
    const data = (await response.json()) as { error?: string };
    if (data.error) detail = data.error;
  } catch {
    /* ignore */
  }
  return detail;
}

/** Chama POST /api/chat e consome stream text/plain; erros vêm como JSON. */
export async function askAssistant(
  message: string,
  history: ChatHistoryItem[] = [],
  idToken?: string | null,
  options: AskAssistantOptions = {}
): Promise<string> {
  if (!idToken) {
    throw new Error('Sessão inválida. Recarregue a página e tente novamente.');
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ message, history } satisfies ChatApiRequest),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const data = (await response.json()) as { text?: string; error?: string };
    if (data.error) throw new Error(data.error);
    const text = data.text?.trim();
    if (!text) throw new Error('Resposta vazia do assistente.');
    options.onChunk?.(text);
    return text;
  }

  if (!response.body) {
    throw new Error('Resposta sem conteúdo.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    if (!chunk) continue;
    full += chunk;
    options.onChunk?.(chunk);
  }

  const tail = decoder.decode();
  if (tail) {
    full += tail;
    options.onChunk?.(tail);
  }

  const text = full.trim();
  if (!text) {
    throw new Error('Resposta vazia do assistente.');
  }
  return text;
}
