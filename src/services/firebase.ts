import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export function isPlaceholder(value: string | undefined): boolean {
  return !value || value.startsWith('YOUR_') || value.includes('SUA_');
}

export type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

let cached: FirebaseServices | null | undefined;

/** Inicializa Firebase sob demanda (lazy). Retorna null se env estiver incompleto. */
export function getFirebase(): FirebaseServices | null {
  if (cached !== undefined) return cached;

  if (isPlaceholder(firebaseConfig.apiKey)) {
    cached = null;
    return cached;
  }

  const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  cached = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };
  return cached;
}
