// firebase.jsx
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAp6wMulhsejedeUTxCkyJ7IMLih5uqSwQ",
    authDomain: "authentication-34575.firebaseapp.com",
    projectId: "authentication-34575",
    storageBucket: "authentication-34575.firebasestorage.app",
    messagingSenderId: "715241589998",
    appId: "1:715241589998:web:f38d960d964ef3531177ff"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);