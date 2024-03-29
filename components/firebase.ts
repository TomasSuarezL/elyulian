import { initializeApp } from "firebase/app";
import { getStorage, ref as stRef } from "firebase/storage";
import { getDatabase, ref as dbRef } from "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyADYVf31hhtXxHhXyMVQWITKAQNNu49S-E",
  authDomain: "elyulian-web.firebaseapp.com",
  projectId: "elyulian-web",
  storageBucket: "elyulian-web.appspot.com",
  messagingSenderId: "759260397926",
  databaseURL: "https://elyulian-web-default-rtdb.firebaseio.com",
  appId: "1:759260397926:web:2b99f367496e64e601c8a7",
};

const app =initializeApp(firebaseConfig);

const storage = getStorage(app);
export const storageRef = stRef(storage);

const database = getDatabase(app);
export const databaseRef = dbRef(database, "audios");
