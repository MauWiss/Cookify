// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCrV9QnQprcyBNO3wqDuvQsQ3CPtoMcQVk",
  authDomain: "thesecretingredient-599a0.firebaseapp.com",
  projectId: "thesecretingredient-599a0",
  storageBucket: "thesecretingredient-599a0.firebasestorage.app",
  messagingSenderId: "348571421123",
  appId: "1:348571421123:web:c542fb31f1880a732dd576",
  measurementId: "G-SVM5JPRG5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// יצוא (export) של auth כדי לגשת אליו בכל מקום באפליקציה
export const auth = getAuth(app)
