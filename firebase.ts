import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Configuração fornecida pelo usuário
export const firebaseConfig = {
  apiKey: "AIzaSyD_C_yn_RyBSopY7Tb9aqLW8akkXJR94Vg",
  authDomain: "chaveunica-225e0.firebaseapp.com",
  projectId: "chaveunica-225e0",
  storageBucket: "chaveunica-225e0.firebasestorage.app",
  messagingSenderId: "324211037832",
  appId: "1:324211037832:web:362a46e6446ea37b85b13d",
  measurementId: "G-MRBDJC3QXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics = null;
try {
  // Analytics can fail in some environments (e.g. strict privacy settings or specific browsers)
  // or if there's a transient loading issue. We wrap it to prevent the app from crashing.
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Firebase Analytics failed to initialize:", e);
}

export { app, analytics };