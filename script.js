import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const loginButton = document.getElementById("login-button");
const loginModal = document.getElementById("login");
const loginClose = document.getElementById("login-close");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const toggleToSignup = document.getElementById("show-signup");
const toggleToLogin = document.getElementById("show-login");
const auctionsContainer = document.getElementById("auctions-container");
const adminPanel = document.getElementById("admin-panel");
const logoutBtn = document.getElementById("logout-button");

loginButton?.addEventListener("click", () => {
  loginModal.style.display = "flex";
});

loginClose?.addEventListener("click", () => {
  loginModal.style.display = "none";
});

toggleToSignup?.addEventListener("click", () => {
  document.getElementById("login-form-fields").style.display = "none";
  signupForm.style.display = "block";
});
toggleToLogin?.addEventListener("click", () => {
  document.getElementById("login-form-fields").style.display = "block";
  signupForm.style.display = "none";
});

document.getElementById("login-button-auth")?.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      localStorage.setItem("userLoggedIn", "true");
      loginModal.style.display = "none";
      window.location.href = "https://ace696134.github.io/index.html";
    })
    .catch(err => alert(err.message));
});

document.getElementById("signup-button")?.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      localStorage.setItem("userLoggedIn", "true");
      window.location.href = "https://ace696134.github.io/index.html";
    })
    .catch(err => alert(err.message));
});

onAuthStateChanged(auth, user => {
  if (user?.email === "houseofforgottendreams@yahoo.com") {
    localStorage.setItem("userLoggedIn", "true");
    document.getElementById("admin-panel")?.style.display = "block";
    document.getElementById("item-form")?.style.display = "block";
  } else {
    document.getElementById("admin-panel")?.style.display = "none";
    document.getElementById("item-form")?.style.display = "none";
  }
});

logoutBtn?.addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem("userLoggedIn");
    window.location.href = "login.html";
  });
});

document.getElementById("add-item")?.addEventListener("click", async () => {
  const title = document.getElementById("item-title").value;
  const description = document.getElementById("item-desc").value;
  const startingBid = parseFloat(document.getElementById("item-price").value);
  const imageUrl = document.getElementById("item-img-url")?.value || "";

  if (!title || !description || isNaN(startingBid)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  await addDoc(collection(db, "auctions"), {
    title,
    description,
    imageUrl,
    startingBid,
    createdAt: serverTimestamp()
  });

  alert("Auction listing added!");
});

if (auctionsContainer) {
  onSnapshot(query(collection(db, "auctions"), orderBy("createdAt", "desc")), (snapshot) => {
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
          <strong>Starting Bid: $${data.startingBid}</strong>
        </div>
      `;
      auctionsContainer.appendChild(card);
    });
  });
}