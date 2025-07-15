// Configuração do Firebase para produção (GitHub Pages)
export const firebaseConfig = {
    apiKey: "AIzaSyBzOdGmNOzRTNgzEPpWPNYjZBqLLZ7i2hU",
    authDomain: "controle-estoque-3b9b7.firebaseapp.com",
    projectId: "controle-estoque-3b9b7",
    storageBucket: "controle-estoque-3b9b7.appspot.com",
    messagingSenderId: "866478824847",
    appId: "1:866478824847:web:123456789abcdef"
};

// Configuração de desenvolvimento (se necessário)
export const firebaseConfigDev = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBzOdGmNOzRTNgzEPpWPNYjZBqLLZ7i2hU",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "controle-estoque-3b9b7.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "controle-estoque-3b9b7",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "controle-estoque-3b9b7.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "866478824847",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:866478824847:web:123456789abcdef"
};

// Usar configuração baseada no ambiente
export const getFirebaseConfig = () => {
    // Em produção (GitHub Pages), usar sempre a configuração hardcoded
    if (import.meta.env.PROD) {
        return firebaseConfig;
    }
    
    // Em desenvolvimento, usar variáveis de ambiente se disponíveis
    return firebaseConfigDev;
};
