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
  const [authError, setAuthError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const firebase = enabled ? getFirebase() : null;
  const configError =
    enabled && !firebase
      ? 'Configuração do Firebase não encontrada. Verifique o arquivo .env'
      : '';
  const error = authError || configError;

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
          setAuthError('Falha ao autenticar. O chat não funcionará.');
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
        setAuthError('Não foi possível carregar o histórico de mensagens.');
      }
    );

    return () => unsubscribe();
  }, [firebase, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !firebase?.db || !userId) return;

    const db = firebase.db;
    const messagesCollectionPath = `chats/${userId}/messages`;
    const text = inputMessage.trim();
    const history: ChatHistoryItem[] = messages.slice(-12).map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      text: msg.text,
    }));

    setInputMessage('');
    setIsTyping(true);

    try {
      await addDoc(collection(db, messagesCollectionPath), {
        text,
        sender: 'user',
        timestamp: Timestamp.now(),
      });

      const idToken = user ? await user.getIdToken() : null;
      const botResponseText = await askAssistant(text, history, idToken);

      await addDoc(collection(db, messagesCollectionPath), {
        text: botResponseText,
        sender: 'bot',
        timestamp: Timestamp.now(),
      });
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      await addDoc(collection(db, messagesCollectionPath), {
        text: `Não consegui responder agora. Tente novamente ou fale conosco pelo WhatsApp: ${PHONE_DISPLAY}.`,
        sender: 'bot',
        timestamp: Timestamp.now(),
      });
    } finally {
      setIsTyping(false);
    }
  }, [firebase, inputMessage, messages, user, userId]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    error,
    messagesEndRef,
    sendMessage,
  };
}
