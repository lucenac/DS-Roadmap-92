// Configuração e inicialização do Firebase
// Este arquivo centraliza a conexão com o Firebase para toda a aplicação

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase usando variáveis de ambiente
// As variáveis NEXT_PUBLIC_ são acessíveis no lado do cliente no Next.js
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o Firebase apenas se ainda não houver uma instância ativa
// Isso evita erros de reinicialização durante o hot-reload do Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Instância de autenticação do Firebase
const auth = getAuth(app);

// Instância do Firestore (banco de dados)
const db = getFirestore(app);

export { app, auth, db };
