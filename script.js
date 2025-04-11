import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const auctionsDiv = document.getElementById("auctions-container");
const loginButton = document.getElementById("login-button");
const loginModal = document.getElementById("login");
const loginClose = document.getElementById("login-close");
const toggleToSignup = document.getElementById("show-signup");
const toggleToLogin = document.getElementById("show-login");

loginButton?.addEventListener("click", () => loginModal.style.display = "flex");
loginClose?.addEventListener("click", () => loginModal.style.display = "none");
toggleToSignup?.addEventListener("click", () => {
  document.getElementById("login-form-fields").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
});
toggleToLogin?.addEventListener("click", () => {
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form-fields").style.display = "block";
});

document.getElementById("login-button-auth")?.addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => loginModal.style.display = "none")
    .catch(err => alert(err.message));
});

document.getElementById("signup-button")?.addEventListener("click", () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => loginModal.style.display = "none")
    .catch(err => alert(err.message));
});

onAuthStateChanged(auth, user => {
  document.getElementById("admin-panel").style.display = user ? "flex" : "none";
  document.getElementById("item-form").style.display = user ? "block" : "none";
});

const q = query(collection(db, "auctions"), orderBy("createdAt", "desc"));
onSnapshot(q, snapshot => {
  auctionsDiv.innerHTML = "";
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
    auctionsDiv.appendChild(card);
  });
});

document.getElementById("add-item")?.addEventListener("click", async () => {
  const title = document.getElementById("item-title").value;
  const description = document.getElementById("item-desc").value;
  const price = parseFloat(document.getElementById("item-price").value);
  const file = document.getElementById("item-img-file").files[0];
  const imageUrl = URL.createObjectURL(file);
  await addDoc(collection(db, "auctions"), {
    title, description, imageUrl, startingBid: price, createdAt: serverTimestamp()
  });
});
