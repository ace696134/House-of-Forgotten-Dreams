
function fetchAuctions() {
  db.collection('auctions').orderBy('endsAt', 'asc').get()
    .then(snap => {
      const auctions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderAuctionList(auctions);
    })
    .catch(err => console.error('Fetch auctions error', err));
}

function renderAuctionList(auctions) {
  const container = document.getElementById("auction-list");
  if (!container) return;
  container.innerHTML = ""; // Clear previous listings

  auctions.forEach(auction => {
    const title = auction.title || "Untitled Auction";
    const description = auction.description || "No description available.";
    const imageUrl = auction.imageUrl || "https://via.placeholder.com/300x200?text=No+Image";

    const card = document.createElement("div");
    card.className = "auction-card";
    card.innerHTML = `
      <img src="${imageUrl}" alt="${title}" class="auction-image">
      <h3>${title}</h3>
      <p>${description}</p>
    `;
    container.appendChild(card);
  });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("User is logged in:", user.email);
    fetchAuctions();
  } else {
    console.log("No user logged in");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("listing-form");
  const message = document.getElementById("listing-message");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const startingBid = parseFloat(document.getElementById("startingBid").value);

      firebase.firestore().collection("auctions").add({
        title,
        description,
        startingBid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        message.textContent = "Listing added successfully!";
        message.style.color = "green";
        form.reset();
      })
      .catch((error) => {
        console.error("Error adding listing:", error);
        message.textContent = "Error adding listing. Check console.";
        message.style.color = "red";
      });
    });
  }
});
