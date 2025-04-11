<!-- Load Firebase and App Check compat scripts -->
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-check-compat.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", () => {
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
    firebase.initializeApp(firebaseConfig);

    // ✅ Initialize App Check with reCAPTCHA
    const appCheck = firebase.appCheck();
    appCheck.activate('6LewEBUrAAAAAILpiN3OfFxxK7CbO6VHht2gJgHC', true); // Your reCAPTCHA Site Key

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

    // Event bindings with null checks
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
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          loginModal.style.display = "none";
        })
        .catch(err => alert(err.message));
    });

    signupForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      auth.createUserWithEmailAndPassword(email, password)
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

    auth.onAuthStateChanged(user => {
      if (adminPanel) {
        adminPanel.style.display = user ? "flex" : "none";
      }
    });

    db.collection("auctions")
      .orderBy("createdAt", "desc")
      .onSnapshot(renderAuctions);
  });
</script>
