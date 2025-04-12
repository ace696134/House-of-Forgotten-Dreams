
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      // optional: store login status
      localStorage.setItem("userLoggedIn", "true");
    })
    .catch(err => alert(err.message));
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "index.html";
  }
});
