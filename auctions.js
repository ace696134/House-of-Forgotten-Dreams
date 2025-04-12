// auctions.js
import { auth, db } from './firebase-config.js';

let isAdmin = false;
let auctions = [];

auth.onAuthStateChanged(user => {
  isAdmin = user?.email === 'houseofforgottendreams@yahoo.com';
  fetchAuctions();
});

function fetchAuctions() {
  db.collection('auctions').orderBy('endsAt', 'asc').get()
    .then(snap => {
      auctions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      applyFilters();
    })
    .catch(err => console.error('Fetch auctions error', err));
}

