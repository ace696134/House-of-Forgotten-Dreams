
import { auth, db } from './firebase-config.js';

function fetchAuctions() {
  db.collection('auctions').orderBy('endsAt', 'asc').get()
    .then(snap => {
      const auctions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log('Auctions:', auctions);
      // applyFilters(); // Uncomment if this function is defined elsewhere
    })
    .catch(err => console.error('Fetch auctions error', err));
}

fetchAuctions();
