// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvPWJT3xeLPiVE6xxavu7brT5XhiavMKg",
  authDomain: "apex-auto-c929c.firebaseapp.com",
  projectId: "apex-auto-c929c",
  storageBucket: "apex-auto-c929c.firebasestorage.app",
  messagingSenderId: "884491668673",
  appId: "1:884491668673:web:82baf3f75ba62df2fbd840",
  measurementId: "G-FN3Q9R1LW8"
};

// Initialize Firebase with error handling
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let analytics: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Initialize Analytics (only in browser)
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export { auth, db, storage, analytics };
export default app;
