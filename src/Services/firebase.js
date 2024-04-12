import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {
    getFirestore,
    collection,
    getDocs
} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBpbaUCpF-ubjMRxmjwj8hGk1ofFXEig3I",
    authDomain: "tunztunzzclothing.firebaseapp.com",
    projectId: "tunztunzzclothing",
    storageBucket: "tunztunzzclothing.appspot.com",
    messagingSenderId: "886513706233",
    appId: "1:886513706233:web:31f60bbed0ee87aec62e28"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const storage = getStorage(app);
