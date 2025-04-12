
function fetchAuctions() {
  db.collection('auctions').orderBy('endsAt', 'asc').get()
    .then(snap => {
      const auctions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log(auctions); // You could render auctions here
    })
    .catch(err => console.error('Fetch auctions error', err));
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("User is logged in:", user.email);
    fetchAuctions();
  } else {
    console.log("No user logged in");
  }
});
