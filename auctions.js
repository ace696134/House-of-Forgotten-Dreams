// auctions.js

// Initialize Firestore
const db = firebase.firestore();

// State
let auctions = [];

// DOM refs
const titleInput       = document.getElementById('titleInput');
const startingBidInput = document.getElementById('startingBidInput');
const endsAtInput      = document.getElementById('endsAtInput');
const saveBtn          = document.getElementById('saveAuctionBtn');

const searchInput      = document.getElementById('searchInput');
const filterSelect     = document.getElementById('filterSelect');
const container        = document.getElementById('auctionsContainer');

// Fetch & render
function fetchAuctions() {
  db.collection('auctions').orderBy('endsAt', 'asc')
    .get()
    .then(snapshot => {
      auctions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      applyFilters();
    });
}

// Render auctions
function renderAuctions(list) {
  container.innerHTML = '';
  list.forEach(item => {
    container.innerHTML += `
      <div class="auction-card" style="border:1px solid #ddd; padding:12px; border-radius:8px; margin-bottom:16px;">
        <h3>${item.title}</h3>
        <p>Current Bid: $${item.currentBid}</p>
        <div class="timer" id="timer-${item.id}" style="font-weight:bold;"></div>
      </div>`;
  });
  startAllTimers();
}

// Filters
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

// Countdown timers
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

// Admin: create auction
saveBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const startingBid = Number(startingBidInput.value);
  const endsAt = new Date(endsAtInput.value).getTime();

  if (!title || !startingBid || !endsAt) {
    return alert('Please fill in all fields with valid values.');
  }

  db.collection('auctions').add({ title, currentBid: startingBid, endsAt })
    .then(() => {
      alert('Auction created!');
      titleInput.value = '';
      startingBidInput.value = '';
      endsAtInput.value = '';
      fetchAuctions();  // refresh
    })
    .catch(err => alert('Error: ' + err.message));
});

// Event listeners
searchInput.addEventListener('input', applyFilters);
filterSelect.addEventListener('change', applyFilters);

// Initialize
fetchAuctions();
