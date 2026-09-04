import { useState, useRef, useEffect, useCallback } from 'react';
import {
  signInAnonymously,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  doc,
  runTransaction,
  type Firestore,
} from 'firebase/firestore';
import { getFirebase } from '@/services/firebase';
import { askAssistant, type ChatHistoryItem } from '@/services/gemini';
import { PHONE_DISPLAY } from '@/constants/contact';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Timestamp;
}

const WELCOME_TEXT =
  'Olá! Bem-vindo à Life Simple. Em que posso ajudar? Você tem interesse por algum produto?';

async function ensureWelcomeMessage(db: Firestore, userId: string): Promise<void> {
  const chatRef = doc(db, 'chats', userId);
  const welcomeRef = doc(db, 'chats', userId, 'messages', 'welcome');

  await runTransaction(db, async (transaction) => {
    const chatSnap = await transaction.get(chatRef);
    if (chatSnap.exists() && chatSnap.data().welcomeSent === true) return;

    transaction.set(
      chatRef,
      { welcomeSent: true, updatedAt: Timestamp.now() },
      { merge: true }
    );
    transaction.set(welcomeRef, {
      text: WELCOME_TEXT,
      sender: 'bot',
      timestamp: Timestamp.now(),
    });
  });
}

export function useChat(enabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [ephemeralError, setEphemeralError] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const firebase = enabled ? getFirebase() : null;
  const setupNotice =
    enabled && !firebase
      ? 'Para começar a usar o assistente, configure antes uma chave de API válida e as configurações do Firebase.'
      : '';
  const error = authError || setupNotice;

  useEffect(() => {
    if (!enabled || !firebase) return;

    const unsubscribe = onAuthStateChanged(firebase.auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        setUserId(authUser.uid);
      } else {
        try {
          await signInAnonymously(firebase.auth);
        } catch (err) {
          console.error('Erro na autenticação anônima:', err);
          setAuthError(
            'O assistente ainda não está disponível nesta sessão. Você pode falar conosco pelo WhatsApp.'
          );
        }
      }
    });

    return unsubscribe;
  }, [enabled, firebase]);

  useEffect(() => {
    if (!firebase?.db || !userId) return;
    const db = firebase.db;

    void ensureWelcomeMessage(db, userId).catch((err) => {
      console.error('Erro ao criar mensagem inicial:', err);
    });

    const messagesCollectionPath = `chats/${userId}/messages`;
    const q = query(collection(db, messagesCollectionPath), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const msgs: ChatMessage[] = [];
        querySnapshot.forEach((document) => {
          msgs.push({ id: document.id, ...(document.data() as Omit<ChatMessage, 'id'>) });
        });
        setMessages(msgs);
      },
      (err) => {
        console.error('Erro ao buscar mensagens:', err);
        setAuthError(
          'Não foi possível carregar o histórico agora. Tente novamente em instantes ou fale pelo WhatsApp.'
        );
      }
    );

    return () => unsubscribe();
  }, [firebase, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, ephemeralError, isTyping]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      if (!firebase?.db || !userId || sendingRef.current) return;

      const text = (overrideText ?? inputMessage).trim();
      if (!text) return;

      const db = firebase.db;
      const messagesCollectionPath = `chats/${userId}/messages`;
      const history: ChatHistoryItem[] = messages.slice(-12).map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        text: msg.text,
      }));

      sendingRef.current = true;
      setInputMessage('');
      setEphemeralError(null);
      setIsTyping(true);
      setStreamingText('');

      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;

      try {
        await addDoc(collection(db, messagesCollectionPath), {
          text,
          sender: 'user',
          timestamp: Timestamp.now(),
        });

        const idToken = user ? await user.getIdToken(false) : null;
        if (!idToken) {
          throw new Error('Sessão inválida');
        }

        const botResponseText = await askAssistant(text, history, idToken, {
          signal: controller.signal,
          onChunk: (chunk) => {
            setStreamingText((prev) => (prev ?? '') + chunk);
          },
        });

        await addDoc(collection(db, messagesCollectionPath), {
          text: botResponseText,
          sender: 'bot',
          timestamp: Timestamp.now(),
        });
        setStreamingText(null);
      } catch (err) {
        if (controller.signal.aborted) {
          setStreamingText(null);
          return;
        }
        console.error('Erro ao enviar mensagem:', err);
        setStreamingText(null);
        const detail =
          err instanceof Error && err.message
            ? err.message
            : `Não consegui responder agora. Tente novamente ou fale conosco pelo WhatsApp: ${PHONE_DISPLAY}.`;
        setEphemeralError(
          detail.includes('WhatsApp')
            ? detail
            : `${detail} WhatsApp: ${PHONE_DISPLAY}.`
        );
      } finally {
        sendingRef.current = false;
        setIsTyping(false);
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    },
    [firebase, inputMessage, messages, user, userId]
  );

  const dismissEphemeralError = useCallback(() => {
    setEphemeralError(null);
  }, []);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    streamingText,
    ephemeralError,
    dismissEphemeralError,
    error,
    messagesEndRef,
    sendMessage,
  };
}
