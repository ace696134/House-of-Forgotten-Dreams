// auctions.js
const db = firebase.firestore();
let auctions = [];
const searchInput  = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const container    = document.getElementById('auctionsContainer');

function fetchAuctions() {
  db.collection('auctions').get().then(snapshot => {
    auctions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    applyFilters();
  });
}

function renderAuctions(list) {
  container.innerHTML = '';
  list.forEach(item => {
    container.innerHTML += `
      <div class="auction-card" data-end="${item.endsAt}">
        <h3>${item.title}</h3>
        <p>Current Bid: $${item.currentBid}</p>
        <div class="timer" id="timer-${item.id}"></div>
      </div>`;
  });
  startAllTimers();
}

function applyFilters() {
  let filtered = auctions.filter(a =>
    a.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  switch (filterSelect.value) {
    case 'ending-soon': filtered.sort((a,b) => a.endsAt - b.endsAt); break;
    case 'price-low-high': filtered.sort((a,b) => a.currentBid - b.currentBid); break;
    case 'price-high-low': filtered.sort((a,b) => b.currentBid - a.currentBid); break;
  }
  renderAuctions(filtered);
}

function startTimer(id, endTimestamp) {
  const el = document.getElementById(`timer-${id}`);
  const update = () => {
    const diff = endTimestamp - Date.now();
    if (diff <= 0) { el.textContent='Ended'; clearInterval(interval); return; }
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

searchInput.addEventListener('input', applyFilters);
filterSelect.addEventListener('change', applyFilters);
fetchAuctions();