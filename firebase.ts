// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDh6DpH22pW0qKJjLLJ3Gq3y1gYZ2e5DsQ",
  authDomain: "link-share-df6b2.firebaseapp.com",
  projectId: "link-share-df6b2",
  storageBucket: "link-share-df6b2.appspot.com",
  messagingSenderId: "442247153566",
  appId: "1:442247153566:web:45de32fce382a4bb78388f",
  measurementId: "G-XER562S4E6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };