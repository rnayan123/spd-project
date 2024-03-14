import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyAIcTRKPgMn4g6bfObi8H6dMiYXcysteH0",
  authDomain: "healthmate-e9565.firebaseapp.com",
  databaseURL: "https://healthmate-e9565-default-rtdb.firebaseio.com",
  projectId: "healthmate-e9565",
  storageBucket: "healthmate-e9565.appspot.com",
  messagingSenderId: "1070886661855",
  appId: "1:1070886661855:web:8e116ad1bb94985078436a",
  measurementId: "G-RJS0V4623D",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { database, storage, auth, firestore };
