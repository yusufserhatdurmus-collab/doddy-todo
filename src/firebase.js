import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Senin Firebase projenin özel anahtarları
const firebaseConfig = {
    apiKey: "AIzaSyDS9jT_6tpwNUuKD_6zlEc38GfxMvHOXzo",
    authDomain: "rpg-todo-app-40b4b.firebaseapp.com",
    projectId: "rpg-todo-app-40b4b",
    storageBucket: "rpg-todo-app-40b4b.firebasestorage.app",
    messagingSenderId: "180726827927",
    appId: "1:180726827927:web:a00a2a45f6de76c23d92d2"
};

// Firebase'i başlatıyoruz
const app = initializeApp(firebaseConfig);

// Auth (Giriş) ve Firestore (Veritabanı) özelliklerini dışa aktarıyoruz
export const auth = getAuth(app);
export const db = getFirestore(app);