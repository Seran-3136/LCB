// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp6wMulhsejedeUTxCkyJ7IMLih5uqSwQ",
  authDomain: "authentication-34575.firebaseapp.com",
  projectId: "authentication-34575",
  storageBucket: "authentication-34575.firebasestorage.app",
  messagingSenderId: "715241589998",
  appId: "1:715241589998:web:f38d960d964ef3531177ff"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {auth}