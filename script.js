// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, addDoc, orderBy, query, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-check-compat.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCMHbxQszAY5DykXY-mPxr1jENu_sWp1NE",
  authDomain: "backend-e5b61.firebaseapp.com",
  projectId: "backend-e5b61",
  storageBucket: "backend-e5b61.appspot.com",
  messagingSenderId: "1081485617349",
  appId: "1:1081485617349:web:073f122bcb6501701068ac",
  measurementId: "G-XFKGCDJ51G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// App Check
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider('6LewEBUrAAAAAILpiN3OfFxxK7CbO6VHht2gJgHC'),
  isTokenAutoRefreshEnabled: true
});

// DOM elements
const auctionsDiv = document.getElementById("auctions-container");
const loginButton = document.getElementById("login-button");
const loginModal = document.getElementById("login");
const loginClose = document.getElementById("login-close");
const loginForm = document.getElementById("login-form-fields");
const signupForm = document.getElementById("signup-form");
const toggleToSignup = document.getElementById("show-signup");
const toggleToLogin = document.getElementById("show-login");
const adminPanel = document.getElementById("admin-panel");
const newAuctionForm = document.getElementById("item-form");

// Auth modal toggle
loginButton?.addEventListener("click", () => {
  loginModal.style.display = "flex";
});
loginClose?.addEventListener("click", () => {
  loginModal.style.display = "none";
});
toggleToSignup?.addEventListener("click", () => {
  loginForm.style.display = "none";
  signupForm.style.display = "block";
});
toggleToLogin?.addEventListener("click", () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
});

// Login
document.getElementById("login-button-auth")?.addEventListener("click", () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      loginModal.style.display = "none";
    })
    .catch(err => alert(err.message));
});

// Signup
document.getElementById("signup-button")?.addEventListener("click", () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      loginModal.style.display = "none";
    })
    .catch(err => alert(err.message));
});

// Add new auction item
document.getElementById("add-item")?.addEventListener("click", async () => {
  const title = document.getElementById("item-title").value;
  const description = document.getElementById("item-desc").value;
  const price = parseFloat(document.getElementById("item-price").value);
  const fileInput = document.getElementById("item-img-file");
  const imageUrl = URL.createObjectURL(fileInput.files[0]); // Placeholder, ideally use Firebase Storage

  try {
    await addDoc(collection(db, "auctions"), {
      title,
      description,
      imageUrl,
      startingBid: price,
      createdAt: serverTimestamp()
    });
    alert("Item added!");
    document.getElementById("item-form").reset();
  } catch (err) {
    alert("Error adding item: " + err.message);
  }
});

// Display auctions
function renderAuctions(snapshot) {
  auctionsDiv.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "auction-card";
    div.innerHTML = `
      <img src="${data.imageUrl}" alt="${data.title}">
      <div class="content">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <strong>Starting Bid: $${data.startingBid.toFixed(2)}</strong>
      </div>
    `;
    auctionsDiv.appendChild(div);
  });
}

// Auth state and admin panel
onAuthStateChanged(auth, user => {
  adminPanel.style.display = user ? "flex" : "none";
  if (user) {
    document.getElementById("item-form").style.display = "block";
  }
});

// Listen to auction updates
onSnapshot(query(collection(db, "auctions"), orderBy("createdAt", "desc")), renderAuctions);
