// firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-check.js';

const firebaseConfig = {
  apiKey: "AIzaSyCMHbxQszAY5DykXY-mPxr1jENu_sWp1NE",
  authDomain: "backend-e5b61.firebaseapp.com",
  projectId: "backend-e5b61",
  storageBucket: "backend-e5b61.appspot.com",
  messagingSenderId: "1081485617349",
  appId: "1:1081485617349:web:073f122bcb6501701068ac",
  measurementId: "G-XFKGCDJ51G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// App Check (reCAPTCHA Enterprise)
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6LewEBUrAAAAAILpiN3OfFxxK7CbO6VHht2gJgHC'),
  isTokenAutoRefreshEnabled: true
});

export { auth, db, firebaseConfig };
