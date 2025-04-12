
let isAdmin = false;

// Wait for Firebase Auth to be ready before fetching auctions
auth.onAuthStateChanged(user => {
  isAdmin = user?.email === 'houseofforgottendreams@yahoo.com';
  fetchAuctions();
});

// Original fetchAuctions function, now runs after auth state is ready
function fetchAuctions() {
  db.collection('auctions').orderBy('endsAt', 'asc').get()
    .then(snap => {
      auctions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      applyFilters();
    })
    .catch(err => console.error('Fetch auctions error', err));
}
