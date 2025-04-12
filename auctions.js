document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('listing-form');
  const message = document.getElementById('listing-message');
  const container = document.getElementById('auctions-container');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      const startingBid = parseFloat(document.getElementById('startingBid').value);
      firebase.firestore().collection('auctions').add({
        title, description, startingBid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        message.textContent = 'Listing added successfully!';
        message.style.color = 'green';
        form.reset();
      }).catch(err => {
        console.error(err);
        message.textContent = 'Failed to add listing.';
        message.style.color = 'red';
      });
    });
  }

  firebase.firestore().collection('auctions').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    container.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement('div');
      div.innerHTML = `<h3>${data.title}</h3><p>${data.description}</p><strong>Starting Bid: $${data.startingBid}</strong>`;
      container.appendChild(div);
    });
  });
});
