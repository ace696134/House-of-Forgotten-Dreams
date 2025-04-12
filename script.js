import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

const ADMIN_EMAIL = "houseofforgottendreams@yahoo.com";

const loginButton = document.getElementById("login-button");
const loginModal = document.getElementById("login");
const loginClose = document.getElementById("login-close");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const toggleToSignup = document.getElementById("show-signup");
const toggleToLogin = document.getElementById("show-login");
const auctionsContainer = document.getElementById("auctions-container");
const adminPanel = document.getElementById("admin-panel");
const logoutBtn = document.getElementById("logout-button");
const itemForm = document.getElementById("item-form");

loginButton?.addEventListener("click", () => {
  loginModal.style.display = "flex";
});

loginClose?.addEventListener("click", () => {
  loginModal.style.display = "none";
});

toggleToSignup?.addEventListener("click", () => {
  document.getElementById("login-form-fields").style.display = "none";
  signupForm.style.display = "block";
});
toggleToLogin?.addEventListener("click", () => {
  document.getElementById("login-form-fields").style.display = "block";
  signupForm.style.display = "none";
});

document.getElementById("login-button-auth")?.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      loginModal.style.display = "none";
    })
    .catch(err => alert(err.message));
});

document.getElementById("signup-button")?.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
});

onAuthStateChanged(auth, (user) => {
  if (user?.email === ADMIN_EMAIL) {
    if (adminPanel) adminPanel.style.display = "block";
    if (itemForm) itemForm.style.display = "block";
  } else {
    if (adminPanel) adminPanel.style.display = "none";
    if (itemForm) itemForm.style.display = "none";
  }
});

logoutBtn?.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});

// Render and display auction items
function renderAuctionItem(doc, user) {
  const data = doc.data();
  const item = document.createElement("div");
  item.className = "auction-item";
  item.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <p>Starting Bid: $${data.startingBid}</p>
    <img src="${data.imageUrl}" alt="${data.title}" style="max-width:200px;" />
    <button class="delete-button" style="display:none;">Delete</button>
  `;

  if (user?.email === ADMIN_EMAIL) {
    const deleteBtn = item.querySelector(".delete-button");
    deleteBtn.style.display = "inline-block";
    deleteBtn.addEventListener("click", async () => {
      try {
        await deleteDoc(doc.ref);
        alert("Item deleted.");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete item.");
      }
    });
  }

  auctionsContainer?.appendChild(item);
}

// Load auctions and show delete button for admin
onAuthStateChanged(auth, (user) => {
  if (auctionsContainer) {
    onSnapshot(query(collection(db, "auctions"), orderBy("createdAt", "desc")), (snapshot) => {
      auctionsContainer.innerHTML = "";
      snapshot.forEach(doc => renderAuctionItem(doc, user));
    });
  }
});

// Handle Add Item button
document.getElementById("add-item")?.addEventListener("click", async () => {
  const title = document.getElementById("item-title").value.trim();
  const description = document.getElementById("item-desc").value.trim();
  const startingBid = parseFloat(document.getElementById("item-price").value.trim());
  const file = document.getElementById("item-img-file").files[0];

  if (!title || !description || isNaN(startingBid) || !file) {
    alert("Please fill in all fields and select an image.");
    return;
  }

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

      alert("Auction item added!");
      document.getElementById("item-title").value = "";
      document.getElementById("item-desc").value = "";
      document.getElementById("item-price").value = "";
      document.getElementById("item-img-file").value = "";

    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add auction item.");
    }
  };

  reader.readAsDataURL(file);
});