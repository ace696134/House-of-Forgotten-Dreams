import { ADMIN_EMAIL } from "./script.js";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// 1) Render all auction cards, each with a hidden .delete-button
db.collection("auctions").get().then(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "auction-card";

    card.innerHTML = `
      <img src="${data.image}" alt="${data.title}" />
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <p>Current bid: $${data.currentBid}</p>
      <button class="bid-button">Bid</button>
      <button class="delete-button" style="display:none">Delete</button>
    `;

    // Bid handler
    card.querySelector(".bid-button")
        .addEventListener("click", () => { /* your bid logic */ });

    // Delete handler
    card.querySelector(".delete-button")
        .addEventListener("click", () => {
          db.collection("auctions").doc(doc.id).delete();
        });

    document.getElementById("auctions-container")
            .appendChild(card);
  });
});

// 2) Once auth state settles, toggle login/logout & all delete-buttons
auth.onAuthStateChanged(user => {
  document.getElementById("login-link").style.display = user ? "none" : "block";
  document.getElementById("logout-button").style.display = user ? "block" : "none";

  document.querySelectorAll(".delete-button").forEach(btn => {
    btn.style.display =
      (user && user.email === ADMIN_EMAIL) ? "block" : "none";
  });
});
