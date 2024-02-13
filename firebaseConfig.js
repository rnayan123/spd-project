// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export { auth, database };
