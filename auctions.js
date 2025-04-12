// auctions.js

// Initialize Firebase services
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// DOM elements
const loginBtn     = document.getElementById('login-button');
const logoutBtn    = document.getElementById('logout-button');
const itemForm     = document.getElementById('item-form');
const titleInput   = document.getElementById('titleInput');
const startingBid  = document.getElementById('startingBidInput');
const endsAtInput  = document.getElementById('endsAtInput');
const imgFileInput = document.getElementById('itemImgFile');
const saveBtn      = document.getElementById('saveAuctionBtn');
const searchInput  = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const container    = document.getElementById('auctionsContainer');

let auctions = [];

// ——— AUTH HANDLING ———
loginBtn.addEventListener('click', () => {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .catch(err => console.error('Login error', err));
});

logoutBtn.addEventListener('click', () => {
  auth.signOut().catch(err => console.error('Logout error', err));
});

auth.onAuthStateChanged(user => {
  if (user) {
    loginBtn.style.display  = 'none';
    logoutBtn.style.display = 'inline-block';
    itemForm.style.display  = 'block';
  } else {
    loginBtn.style.display  = 'inline-block';
    logoutBtn.style.display = 'none';
    itemForm.style.display  = 'none';
  }
});

// ——— FETCH & RENDER ———
function fetchAuctions() {
  db.collection('auctions').orderBy('endsAt', 'asc').get()
    .then(snap => {
      auctions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      applyFilters();
    })
    .catch(err => console.error('Fetch auctions error', err));
}

function renderAuctions(list) {
  container.innerHTML = '';
  list.forEach(item => {
    const user = auth.currentUser;
    const isAdmin = user && user.email === 'houseofforgottendreams@yahoo.com';

    container.innerHTML += `
      <div class="auction-card" style="border:1px solid #ddd; padding:12px; border-radius:8px; margin-bottom:16px;">
        <img src="${item.imageBase64}" alt="${item.title}" style="max-width:100%; border-radius:4px;"/>
        <h3>${item.title}</h3>
        <p>Current Bid: $${item.currentBid}</p>
        <div class="timer" id="timer-${item.id}" style="font-weight:bold;"></div>
        ${isAdmin ? `<button onclick="deleteAuction('${item.id}')" style="margin-top:10px; background:#c00; color:white; border:none; padding:6px 10px; border-radius:4px;">Delete</button>` : ''}
      </div>`;
  });
  startAllTimers();
}


// ——— SEARCH & FILTER ———
function applyFilters() {
  let filtered = auctions.filter(a =>
    a.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  switch (filterSelect.value) {
    case 'ending-soon':
      filtered.sort((a,b) => a.endsAt - b.endsAt);
      break;
    case 'price-low-high':
      filtered.sort((a,b) => a.currentBid - b.currentBid);
      break;
    case 'price-high-low':
      filtered.sort((a,b) => b.currentBid - a.currentBid);
      break;
  }
  renderAuctions(filtered);
}

searchInput.addEventListener('input', applyFilters);
filterSelect.addEventListener('change', applyFilters);

// ——— COUNTDOWN TIMERS ———
function startTimer(id, endTimestamp) {
  const el = document.getElementById(`timer-${id}`);
  const update = () => {
    const diff = endTimestamp - Date.now();
    if (diff <= 0) {
      el.textContent = '⏰ Ended';
      clearInterval(interval);
      return;
    }
    const hrs = Math.floor(diff/3600000);
    const mins = Math.floor((diff%3600000)/60000);
    const secs = Math.floor((diff%60000)/1000);
    el.textContent = `${hrs}h ${mins}m ${secs}s`;
  };
  update();
  const interval = setInterval(update, 1000);
}

function startAllTimers() {
  auctions.forEach(item => startTimer(item.id, item.endsAt));
}

// ——— ADMIN: CREATE AUCTION (Base64 image) ———
saveBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const bid   = Number(startingBid.value);
  const ends  = new Date(endsAtInput.value).getTime();
  const file  = imgFileInput.files[0];

  if (!title || !bid || !ends || !file) {
    return alert('Please fill all fields and select an image.');
  }

  const reader = new FileReader();
  reader.onload = () => {
    const base64Image = reader.result;
    db.collection('auctions').add({
      title,
      currentBid: bid,
      endsAt: ends,
      imageBase64: base64Image
    })
    .then(() => {
      alert('Auction created!');
      titleInput.value = '';
      startingBid.value = '';
      endsAtInput.value = '';
      imgFileInput.value = '';
      fetchAuctions();
    })
    .catch(err => {
      console.error('Create auction error', err);
      alert('Error creating auction: ' + err.message);
    });
  };
  reader.readAsDataURL(file);
});

// ——— INITIALIZE ———
fetchAuctions();
