// firebase-config.js
// Load Firebase SDK from CDN
const firebaseConfig = {
  apiKey: "AIzaSyCMHbxQszAY5DykXY-mPxr1jENu_sWp1NE",
  authDomain: "backend-e5b61.firebaseapp.com",
  projectId: "backend-e5b61",
  storageBucket: "backend-e5b61.appspot.com",
  messagingSenderId: "1081485617349",
  appId: "1:1081485617349:web:073f122bcb6501701068ac",
  measurementId: "G-XFKGCDJ51G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export auth and db for use in other scripts
export const auth = firebase.auth();
export const db = firebase.firestore();
