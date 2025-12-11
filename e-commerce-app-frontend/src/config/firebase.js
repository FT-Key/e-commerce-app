// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validar que las variables estén configuradas
const isFirebaseConfigured = () => {
  return Object.values(firebaseConfig).every(value => value && value !== 'undefined');
};

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account"
    });
  } catch (error) {
    console.error('Error inicializando Firebase:', error);
  }
} else {
  console.warn('⚠️ Firebase no está configurado. Por favor, configura las variables de entorno en .env');
}

export { auth, googleProvider };