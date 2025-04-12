// admin.js
const db = firebase.firestore();
const titleInput = document.getElementById('titleInput');
const startingBidInput = document.getElementById('startingBidInput');
const endsAtInput = document.getElementById('endsAtInput');
const saveBtn = document.getElementById('saveAuctionBtn');
saveBtn.addEventListener('click', () => {
  const endsAt = new Date(endsAtInput.value).getTime();
  db.collection('auctions').add({
    title: titleInput.value,
    currentBid: Number(startingBidInput.value),
    endsAt
  }).then(() => {
    alert('Auction created!');
    titleInput.value=''; startingBidInput.value=''; endsAtInput.value='';
  }).catch(err => alert('Error: '+err.message));
});