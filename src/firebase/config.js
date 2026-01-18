import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBCWKF6D6cB4PFDL65DyxM9_l12K6ZK26Y",
  authDomain: "secti-551ad.firebaseapp.com",
  projectId: "secti-551ad",
  storageBucket: "secti-551ad.firebasestorage.app",
  messagingSenderId: "854998983216",
  appId: "1:854998983216:web:f0c7188d151147db4743f5",
  measurementId: "G-F8MJSKY6YM"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Exporte os serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;