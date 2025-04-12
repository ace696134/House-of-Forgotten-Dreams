
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
document.getElementById("add-item")?.addEventListener("click", async () => {
  const title = document.getElementById("item-title").value;
  const description = document.getElementById("item-desc").value;
  const startingBid = document.getElementById("item-price").value;
  const file = document.getElementById("item-img-file").files[0];

  if (!file || !title || !description || !startingBid) {
    alert("Please fill all fields and select an image.");
    return;
  }

  // Convert image to base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result;

    try {
      await addDoc(collection(db, "auctions"), {
        title,
        description,
        startingBid,
        imageUrl: base64Image,
        createdAt: serverTimestamp()
      });

      alert("Item added!");
      document.getElementById("item-title").value = "";
      document.getElementById("item-desc").value = "";
      document.getElementById("item-price").value = "";
      document.getElementById("item-img-file").value = "";
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item.");
    }
  };

  reader.readAsDataURL(file);
});


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
