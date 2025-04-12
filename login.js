// login.js
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    document.getElementById('login-message').textContent = "Login successful!";
    // Optionally redirect: window.location.href = 'dashboard.html';
  } catch (error) {
    document.getElementById('login-message').textContent = "Login failed: " + error.message;
  }
});

