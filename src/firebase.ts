// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARSCl1dn8uX0WaaI3lgGvXKT4W9OgIUwU",
  authDomain: "essabarber-app.firebaseapp.com",
  projectId: "essabarber-app",
  storageBucket: "essabarber-app.appspot.com",
  messagingSenderId: "550178930057",
  appId: "1:550178930057:android:4cc686ede793c9c4f23558",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
