// Firebase config (replace with your actual config)
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Elements
const auctionsDiv = document.getElementById("auctions");
const loginButton = document.getElementById("login-button");
const loginModal = document.getElementById("login");
const loginClose = document.getElementById("login-close");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form-actual");
const toggleToSignup = document.getElementById("show-signup");
const toggleToLogin = document.getElementById("show-login");
const adminPanel = document.getElementById("admin-panel");
const newAuctionForm = document.getElementById("new-auction-form");

// Show login modal
loginButton.addEventListener("click", () => {
  loginModal.style.display = "flex";
});

// Hide login modal
loginClose.addEventListener("click", () => {
  loginModal.style.display = "none";
});

// Toggle to signup form
toggleToSignup.addEventListener("click", () => {
  document.getElementById("login-form-fields").style.display = "none";
  document.getElementById("signup-form").style.display = "block";
});

// Toggle to login form
toggleToLogin.addEventListener("click", () => {
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form-fields").style.display = "block";
});

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      loginModal.style.display = "none";
    })
    .catch(err => alert(err.message));
});

// Signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      loginModal.style.display = "none";
    })
    .catch(err => alert(err.message));
});

// Add new auction
newAuctionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = newAuctionForm["title"].value;
  const description = newAuctionForm["description"].value;
  const imageUrl = newAuctionForm["image"].value;
  const startingBid = parseFloat(newAuctionForm["startingBid"].value);

  db.collection("auctions").add({
    title,
    description,
    imageUrl,
    startingBid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    newAuctionForm.reset();
    alert("Auction created!");
  }).catch(err => alert(err.message));
});

// Render auctions
function renderAuctions(snapshot) {
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

// Listen for auth changes
auth.onAuthStateChanged(user => {
  if (user) {
    adminPanel.style.display = "flex";
  } else {
    adminPanel.style.display = "none";
  }
});

// Listen for auctions
db.collection("auctions")
  .orderBy("createdAt", "desc")
  .onSnapshot(renderAuctions);
