// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBb8A2i7jQ7g5qZGT24FKQgBDvLHtdTt_o",
//   authDomain: "invmanagement-774b6.firebaseapp.com",
//   projectId: "invmanagement-774b6",
//   storageBucket: "invmanagement-774b6.firebasestorage.app",
//   messagingSenderId: "891974729305",
//   appId: "1:891974729305:web:f7bdc44b57b9d13063fb48",
//   measurementId: "G-VJRVCW7CPK"
// };

// // Initialize Firebase

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:  "AIzaSyBb8A2i7jQ7g5qZGT24FKQgBDvLHtdTt_o",
  authDomain: "invmanagement-774b6.firebaseapp.com",
  projectId:  "invmanagement-774b6",
  storageBucket:  "invmanagement-774b6.firebasestorage.app",
  messagingSenderId: "891974729305",
  appId: "1:891974729305:web:f7bdc44b57b9d13063fb48",
  measurementId: "G-VJRVCW7CPK",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();