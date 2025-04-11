import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// DOM Elements
const auctionsContainer = document.getElementById("auctions-container");
const loginButton = document.getElementById("login-button");
const loginModal  = document.getElementById("login");
const loginClose  = document.getElementById("login-close");
const loginAuthBtn= document.getElementById("login-button-auth");
const signupBtn   = document.getElementById("signup-button");
const toggleToSignup = document.getElementById("show-signup");
const toggleToLogin  = document.getElementById("show-login");
const adminPanel     = document.getElementById("admin-panel");
const itemForm       = document.getElementById("item-form");
const addItemBtn     = document.getElementById("add-item");

// Show / hide login modal
loginButton?.addEventListener("click", () => loginModal.style.display = "flex");
loginClose?.addEventListener("click", () => loginModal.style.display = "none");

// Toggle forms
toggleToSignup?.addEventListener("click", () => {
  document.getElementById("login-form-fields").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
});
toggleToLogin?.addEventListener("click", () => {
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form-fields").style.display = "block";
});

// Login
loginAuthBtn?.addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => loginModal.style.display = "none")
    .catch(err => alert(err.message));
});

// Signup
signupBtn?.addEventListener("click", () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => loginModal.style.display = "none")
    .catch(err => alert(err.message));
});

// Auth observer
onAuthStateChanged(auth, user => {
  adminPanel.style.display = user ? "flex" : "none";
  itemForm.style.display   = user ? "block" : "none";
});

// Render auctions
const auctionsQuery = query(collection(db, "auctions"), orderBy("createdAt", "desc"));
onSnapshot(auctionsQuery, snapshot => {
  auctionsContainer.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "auction-card";
    card.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.title}">
      <div class="content">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <strong>Starting Bid: $${data.startingBid.toFixed(2)}</strong>
      </div>
    `;
    auctionsContainer.appendChild(card);
  });
});

// Add auction
addItemBtn?.addEventListener("click", async () => {
  const title = document.getElementById("item-title").value.trim();
  const description = document.getElementById("item-desc").value.trim();
  const price = parseFloat(document.getElementById("item-price").value);
  const file = document.getElementById("item-img-file").files[0];
  if (!title || !description || !price || !file) return alert("Fill all fields and select an image.");
  const reader = new FileReader();
  reader.onload = async () => {
    await addDoc(collection(db, "auctions"), {
      title,
      description,
      imageUrl: reader.result,
      startingBid: price,
      createdAt: serverTimestamp()
    });
  };
  reader.readAsDataURL(file);
});

// Logout
document.getElementById("logout-button")?.addEventListener("click", () => signOut(auth));
