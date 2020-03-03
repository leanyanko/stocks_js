import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyDOHQam-X29m1Dj3weVDtZ45foSRPV9AII",
    authDomain: "stocks-99f6e.firebaseapp.com",
    databaseURL: "https://stocks-99f6e.firebaseio.com",
    projectId: "stocks-99f6e",
    storageBucket: "stocks-99f6e.appspot.com",
    messagingSenderId: "69747646480",
    appId: "1:69747646480:web:ef2c84ef55c12afd76aa95",
    measurementId: "G-LDF784CZT3"
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
// firebase.analytics();


export { fire };
