import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFirebaseConfig } from '../firebase-config';

// Usar a configuração apropriada baseada no ambiente
const config = getFirebaseConfig();

// Inicialização mais segura para evitar re-inicialização em HMR (Hot Module Replacement)
const app = !getApps().length ? initializeApp(config) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
