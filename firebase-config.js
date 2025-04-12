// firebase-config.js

// Firebase config for classic (compat) SDK
const firebaseConfig = {
  apiKey: "AIzaSyCMHbxQszAY5DykXY-mPxr1jENu_sWp1NE",
  authDomain: "backend-e5b61.firebaseapp.com",
  projectId: "backend-e5b61",
  storageBucket: "backend-e5b61.appspot.com",
  messagingSenderId: "1081485617349",
  appId: "1:1081485617349:web:073f122bcb6501701068ac",
  measurementId: "G-XFKGCDJ51G"
};

// Initialize Firebase (global firebase object)
firebase.initializeApp(firebaseConfig);

// Enable reCAPTCHA App Check
firebase.appCheck().activate(
  '6LcEHxUrAAAAAKsdofqix1KIi0SPkMFerJIuwlfk',
  true // Enable automatic token refresh
);
