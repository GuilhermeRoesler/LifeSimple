import { describe, expect, it } from 'vitest';
import {
  MAX_MESSAGE_CHARS,
  validateChatPayload,
} from './chatLimits.ts';
import { extractBearerToken } from './firebaseAuth.ts';

describe('extractBearerToken', () => {
  it('aceita Bearer token', () => {
    expect(extractBearerToken('Bearer abc.def.ghi')).toBe('abc.def.ghi');
  });

  it('rejeita header inválido', () => {
    expect(extractBearerToken('Basic xxx')).toBeNull();
    expect(extractBearerToken(undefined)).toBeNull();
    expect(extractBearerToken('')).toBeNull();
  });
});

describe('validateChatPayload', () => {
  it('aceita mensagem válida', () => {
    const result = validateChatPayload({
      message: '  Olá  ',
      history: [{ role: 'user', text: 'Oi' }],
    });
    expect(result).toEqual({
      ok: true,
      message: 'Olá',
      history: [{ role: 'user', text: 'Oi' }],
    });
  });

  it('rejeita mensagem vazia', () => {
    expect(validateChatPayload({ message: '   ' })).toMatchObject({
      ok: false,
      status: 400,
    });
  });

  it('rejeita mensagem longa demais', () => {
    const result = validateChatPayload({
      message: 'x'.repeat(MAX_MESSAGE_CHARS + 1),
    });
    expect(result).toMatchObject({ ok: false, status: 413 });
  });

  it('trunca histórico longo e ignora itens inválidos', () => {
    const result = validateChatPayload({
      message: 'ok',
      history: [
        { role: 'system', text: 'nope' },
        { role: 'user', text: 'a'.repeat(5_000) },
        { role: 'model', text: 'resposta' },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.history).toHaveLength(2);
    expect(result.history[0]!.text).toHaveLength(2_000);
    expect(result.history[1]!.text).toBe('resposta');
  });
});
