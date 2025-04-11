import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
// Use the modular App Check SDK here:
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-check.js";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  // etc.
};

const app = initializeApp(firebaseConfig);

// Initialize App Check using modular SDK
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6LewEBUrAAAAAILpiN3OfFxxK7CbO6VHht2gJgHC'),
  isTokenAutoRefreshEnabled: true,
});

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
