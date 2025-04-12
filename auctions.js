document.addEventListener("DOMContentLoaded", () => {
  const auctionsContainer = document.getElementById("auctions-container");

  firebase.firestore().collection("auctions").get().then((querySnapshot) => {
    if (querySnapshot.empty) {
      auctionsContainer.innerHTML = "<p>No auctions available at the moment.</p>";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "auction-item";
      div.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <p><strong>Starting bid:</strong> $${data.startingBid}</p>
      `;
      auctionsContainer.appendChild(div);
    });
  }).catch((error) => {
    auctionsContainer.innerHTML = "<p>Error loading auctions.</p>";
    console.error("Error fetching auctions:", error);
  });
});
