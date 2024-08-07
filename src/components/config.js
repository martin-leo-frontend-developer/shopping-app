
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";

import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBIPzIuad25EYpSGYcuWaiUSU4G9t7WR1A",
  authDomain: "shopping-568d2.firebaseapp.com",
  projectId: "shopping-568d2",
  storageBucket: "shopping-568d2.appspot.com",
  messagingSenderId: "678533035799",
  appId: "1:678533035799:web:a3a2e10faffdb34b8be952"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize auth
export const auth = getAuth(app)

//Initialize firestore
export const db = getFirestore(app)

//Initialize storage
export const storage = getStorage(app)

//Initialize messaging
export const messaging = getMessaging(app)