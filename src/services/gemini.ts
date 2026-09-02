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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers,
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
