// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth, GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgA89FrVk6GZ4L4en1O8OZgOdNrwWde9s",
  authDomain: "quora-378b0.firebaseapp.com",
  projectId: "quora-378b0",
  storageBucket: "quora-378b0.appspot.com",
  messagingSenderId: "182337247334",
  appId: "1:182337247334:web:d64db6534727da22acf5a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider
export const facebookProvider = new FacebookAuthProvider