import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, collection, addDoc, orderBy, query, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { initializeAppCheck } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-check-compat.js";

document.addEventListener("DOMContentLoaded", () => {
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
  const appCheck = initializeAppCheck(app, {
    provider: new firebase.appCheck.ReCaptchaV3Provider('6LewEBUrAAAAAILpiN3OfFxxK7CbO6VHht2gJgHC'),
    isTokenAutoRefreshEnabled: true
  });

  const db = getFirestore(app);
  const auth = getAuth(app);

  const auctionsDiv = document.getElementById("auctions");
  const loginButton = document.getElementById("login-button");
  const loginModal = document.getElementById("login");
  const loginClose = document.getElementById("login-close");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const toggleToSignup = document.getElementById("show-signup");
  const toggleToLogin = document.getElementById("show-login");
  const adminPanel = document.getElementById("admin-panel");
  const newAuctionForm = document.getElementById("new-auction-form");

  loginButton?.addEventListener("click", () => {
    loginModal.style.display = "flex";
  });

  loginClose?.addEventListener("click", () => {
    loginModal.style.display = "none";
  });

  toggleToSignup?.addEventListener("click", () => {
    document.getElementById("login-form-fields").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
  });

  toggleToLogin?.addEventListener("click", () => {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form-fields").style.display = "block";
  });

  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        loginModal.style.display = "none";
      })
      .catch(err => alert(err.message));
  });

  signupForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        loginModal.style.display = "none";
      })
      .catch(err => alert(err.message));
  });

  newAuctionForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = newAuctionForm["title"].value;
    const description = newAuctionForm["description"].value;
    const imageUrl = newAuctionForm["image"].value;
    const startingBid = parseFloat(newAuctionForm["startingBid"].value);

    addDoc(collection(db, "auctions"), {
      title,
      description,
      imageUrl,
      startingBid,
      createdAt: serverTimestamp()
    }).then(() => {
      newAuctionForm.reset();
      alert("Auction created!");
    }).catch(err => alert(err.message));
  });

  function renderAuctions(snapshot) {
    if (!auctionsDiv) return;
    auctionsDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const auction = doc.data();
      const card = document.createElement("div");
      card.className = "auction-card";
      card.innerHTML = `
        <img src="${auction.imageUrl}" alt="${auction.title}">
        <div class="content">
          <h3>${auction.title}</h3>
          <p>${auction.description}</p>
          <strong>Starting Bid: $${auction.startingBid.toFixed(2)}</strong>
        </div>
      `;
      auctionsDiv.appendChild(card);
    });
  }

  onAuthStateChanged(auth, user => {
    if (adminPanel) {
      adminPanel.style.display = user ? "flex" : "none";
    }
  });

  const q = query(collection(db, "auctions"), orderBy("createdAt", "desc"));
  onSnapshot(q, renderAuctions);
});
