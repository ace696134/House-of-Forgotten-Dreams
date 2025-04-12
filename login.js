// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js'; // importing the config object

const app = initializeApp(firebaseConfig); // initialize Firebase with config
const auth = getAuth(app); // get auth instance

// Set auth persistence to stay logged in
setPersistence(auth, browserLocalPersistence);

const loginForm = document.getElementById('login-form');
const message = document.getElementById('login-message');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    message.textContent = 'Logged in!';
    message.style.color = 'lightgreen';

    localStorage.setItem('userLoggedIn', 'true');

    // Redirect to your main site
    setTimeout(() => {
      window.location.href = 'https://ace696134.github.io/index.html';
    }, 500);
  } catch (error) {
    message.textContent = error.message;
    message.style.color = 'red';
  }
});

