import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyADYVf31hhtXxHhXyMVQWITKAQNNu49S-E",
  authDomain: "elyulian-web.firebaseapp.com",
  projectId: "elyulian-web",
  storageBucket: "elyulian-web.appspot.com",
  messagingSenderId: "759260397926",
  databaseURL: "https://elyulian-web-default-rtdb.firebaseio.com",
  appId: "1:759260397926:web:2b99f367496e64e601c8a7",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const storage = firebase.storage();

export const database = firebase.database();
