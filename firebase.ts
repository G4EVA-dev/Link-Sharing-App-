// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAim9Om0Mxmd9eHRogiyUIjrg_yhTCJiHQ",
  authDomain: "showfolio-20122.firebaseapp.com",
  projectId: "showfolio-20122",
  storageBucket: "showfolio-20122.firebasestorage.app",
  messagingSenderId: "1021947918813",
  appId: "1:1021947918813:web:6fdb97a912720ca18f1e34",
  measurementId: "G-8T9Y6G0BP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
