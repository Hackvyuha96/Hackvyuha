import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAOE5ATMKLitW3J2Hs80A_sDk45e-jtsXc",
  authDomain: "taskmanagement-3fe74.firebaseapp.com",
  projectId: "taskmanagement-3fe74",
  storageBucket: "taskmanagement-3fe74.appspot.com",
  messagingSenderId: "552217409531",
  appId: "1:552217409531:web:6d6bc8550ad0e7b09e3d5e",
  measurementId: "G-6CQH9H4V8H"
};
 
const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const db = app.firestore();

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION) //session wont be stay logged in when closes the browser and will resume when reopen the browser

export default app;