// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6iACs5O5M7hG-JGHnvJtbJ0FgV78u4_E",
  authDomain: "blog-c220d.firebaseapp.com",
  projectId: "blog-c220d",
  storageBucket: "blog-c220d.appspot.com",
  messagingSenderId: "662728970555",
  appId: "1:662728970555:web:88d885ad96916dc7a7271e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };
