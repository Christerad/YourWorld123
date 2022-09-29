import { async } from '@firebase/util'
import * as firebase from 'firebase/app'
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const config ={
    apiKey: "AIzaSyBaDLMzYMh3qYcEtO5gGK4gqosGl0kAvrg",
    authDomain: "gamification-ionic.firebaseapp.com",
    databaseURL: "https://gamification-ionic-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gamification-ionic",
    storageBucket: "gamification-ionic.appspot.com",
    messagingSenderId: "427085462959",
    appId: "1:427085462959:web:06f3725dbc02eb3481435a",
    measurementId: "G-90XYD9TNKQ"
    
}

const app =firebase.initializeApp(config)


export const auth = getAuth();

export const db = getFirestore(app);

const database = getDatabase(app);