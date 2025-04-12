
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { app } from './firebase-config.js';

const db = getFirestore(app);
const auth = getAuth(app);

// Show admin controls if logged in as admin
onAuthStateChanged(auth, user => {
  const itemForm = document.getElementById("item-form");
  const adminPanel = document.getElementById("admin-panel");

  if (user?.email === "houseofforgottendreams@yahoo.com") {
    localStorage.setItem("userLoggedIn", "true");
    if (itemForm) itemForm.style.display = "block";
    if (adminPanel) adminPanel.style.display = "block";
  } else {
    if (itemForm) itemForm.style.display = "none";
    if (adminPanel) adminPanel.style.display = "none";
  }
});

// Add item to Firestore
const addItemButton = document.getElementById("add-item");
if (addItemButton) {
  addItemButton.addEventListener("click", async () => {
    const title = document.getElementById("item-title").value;
    const desc = document.getElementById("item-desc").value;
    const price = document.getElementById("item-price").value;

    const item = {
      title,
      desc,
      price,
      createdAt: new Date()
    };

    try {
      await addDoc(collection(db, "auctions"), item);
      alert("Item added!");
      location.reload();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  });
}

// Display items
async function displayItems() {
  const container = document.getElementById("auctions-container");
  if (!container) return;

  const querySnapshot = await getDocs(collection(db, "auctions"));
  container.innerHTML = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "auction-card";
    card.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.desc}</p>
      <p>Price: $${data.price}</p>
    `;
    container.appendChild(card);
  });
}

displayItems();
