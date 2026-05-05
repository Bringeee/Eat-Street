import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDJHSHKGAjheqqxmREIV-JZn1b9hE0nEs8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eat-street-restaurant-f3444.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eat-street-restaurant-f3444",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eat-street-restaurant-f3444.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "751846051946",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:751846051946:web:82852cf281c27d9fa4fa13",
};

// Check if Firebase config is available
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn("Firebase configuration not found. Please set environment variables in .env.local");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

// Database types
export interface FirebaseReview {
  id?: string;
  name: string;
  rating: number;
  text: string;
  createdAt: number;
  updatedAt?: number;
}

export interface FirebaseReviewDocument extends FirebaseReview {
  id: string;
}
