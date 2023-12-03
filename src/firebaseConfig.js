// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyBYUOTS6_mppusRnWu8vPDloYAcGRdEAng",
    authDomain: "animal-dating-app-12de9.firebaseapp.com",
    projectId: "animal-dating-app-12de9",
    storageBucket: "animal-dating-app-12de9.appspot.com",
    messagingSenderId: "912033005030",
    appId: "1:912033005030:web:68865fbbfe4406978fea27",
    measurementId: "G-3D2FLJ1JRS"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, storage, db, functions }