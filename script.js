// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
const signupForm = document.getElementById("signup-form");
const toggleToSignup = document.getElementById("toggle-to-signup");
const toggleToLogin = document.getElementById("toggle-to-login");
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
  loginForm.style.display = "none";
  signupForm.style.display = "block";
});

// Toggle to login form
toggleToLogin.addEventListener("click", () => {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
});

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      loginModal.style.display = "none";
    })
    .catch(err => alert(err.message));
});

// Signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
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
