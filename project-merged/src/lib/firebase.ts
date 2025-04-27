import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBshK829lAT1CI2x2ajsN9V4PFp057V2K0",
  authDomain: "scailertest-37078.firebaseapp.com",
  projectId: "scailertest-37078",
  storageBucket: "scailertest-37078.firebasestorage.app",
  messagingSenderId: "1090300202633",
  appId: "1:1090300202633:web:9942ed5b06e750f0ec8058",
  measurementId: "G-F3GB7MV5K3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics and export it
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; 