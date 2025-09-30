import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration for Contact/Inquiries
const firebaseContactConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_CONTACT_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_CONTACT_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_CONTACT_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_CONTACT_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_CONTACT_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_CONTACT_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_CONTACT_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_CONTACT_MEASUREMENT_ID
};

// Initialize Firebase for Contact (as secondary app)
const contactApp = initializeApp(firebaseContactConfig, 'contact');

// Initialize Firebase services for contact
export const contactAuth = getAuth(contactApp);
export const contactDatabase = getDatabase(contactApp);

export default contactApp;