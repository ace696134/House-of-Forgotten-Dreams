// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js'; // Make sure this file exists

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Keep user logged in even after refreshing
setPersistence(auth, browserLocalPersistence);

const loginForm = document.getElementById('login-form');
const message = document.getElementById('login-message');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    message.textContent = 'Logged in!';
    message.style.color = 'lightgreen';
    
    localStorage.setItem('userLoggedIn', 'true');
    window.location.href = 'index.html';
     // Redirect after login
  } catch (error) {
    message.textContent = error.message;
    message.style.color = 'red';
  }
});
