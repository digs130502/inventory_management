// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqlbzCUcAXAJlTMfzmAY502X9jbEMe6pE",
  authDomain: "inventory-managment-8e88f.firebaseapp.com",
  projectId: "inventory-managment-8e88f",
  storageBucket: "inventory-managment-8e88f.appspot.com",
  messagingSenderId: "392084629583",
  appId: "1:392084629583:web:714945722e8b4ce194a23a",
  measurementId: "G-5XEP8EVYWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);