// Импортируйте необходимые функции из SDK
import { initializeApp } from "firebase/app";

// Конфигурация вашего веб-приложения Firebase
const firebaseConfig = {
  authDomain: "lottery-159de.firebaseapp.com",
  projectId: "lottery-159de",
  storageBucket: "lottery-159de.appspot.com",
  messagingSenderId: "314576181334",
  appId: "1:314576181334:web:5fb6f1c70648c04b5c83f7",
  measurementId: "G-MH76DF0KC2"
};

const app = initializeApp(firebaseConfig);
const admin = require('firebase-admin');