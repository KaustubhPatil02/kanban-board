import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIHt4YpV8Beraa6bsuUflyjErx75_EVXo",
  authDomain: "kanban-74300.firebaseapp.com",
  projectId: "kanban-74300",
  storageBucket: "kanban-74300.firebasestorage.app",
  messagingSenderId: "364257884711",
  appId: "1:364257884711:web:7f31dab8f92344eb0eec02"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
