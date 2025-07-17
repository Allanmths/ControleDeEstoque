import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDSFjbUSTHbp6dRp9s8p6DG9NrppBUmMJM",
  authDomain: "controle-de-estoque-5c5f8.firebaseapp.com",
  projectId: "controle-de-estoque-5c5f8",
  storageBucket: "controle-de-estoque-5c5f8.appspot.com",
  messagingSenderId: "590075993962",
  appId: "1:590075993962:web:f8a9b2a3e4d5c6f7g8h9i0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  try {
    // Only connect to emulators if not already connected
    if (!auth._delegate._config.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
    if (!db._delegate._databaseId.projectId.includes('demo-')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    if (!storage._delegate._location.bucket.includes('demo-')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
  } catch (error) {
    console.log('Emulators already connected or not available');
  }
}

export default app;
