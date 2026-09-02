export type ChatHistoryItem = {
  role: 'user' | 'model';
  text: string;
};

export type ChatApiRequest = {
  message: string;
  history?: ChatHistoryItem[];
};

export type ChatApiResponse = {
  text: string;
};

export async function askAssistant(
  message: string,
  history: ChatHistoryItem[] = [],
  idToken?: string | null
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
  });

  if (!response.ok) {
    let detail = `Erro ${response.status}`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) detail = data.error;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }

  const data = (await response.json()) as ChatApiResponse;
  return data.text;
}
