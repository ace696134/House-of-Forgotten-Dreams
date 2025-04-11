import { db, auth, ref, set, get, onValue, remove, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase-config.js';

const itemsRef = ref(db, 'auctionItems');
let isAdmin = false;

// UI Elements
const authModal   = document.getElementById('login');
const openModal   = document.getElementById('login-button');
const closeModal  = document.getElementById('login-close');
const showSignup  = document.getElementById('show-signup');
const showLogin   = document.getElementById('show-login');
const loginFields = document.getElementById('login-form-fields');
const signupForm  = document.getElementById('signup-form');
const authTitle   = document.getElementById('auth-title');
const signupBtn   = document.getElementById('signup-button');
const loginAuthBtn= document.getElementById('login-button-auth');
const logoutBtn   = document.getElementById('logout-button');

// Modal control
openModal.addEventListener('click', () => authModal.style.display = 'flex');
closeModal.addEventListener('click', () => authModal.style.display = 'none');
showSignup.addEventListener('click', () => {
  authTitle.textContent = 'Sign Up';
  loginFields.style.display = 'none';
  signupForm.style.display = 'block';
});
showLogin.addEventListener('click', () => {
  authTitle.textContent = 'Log In';
  signupForm.style.display = 'none';
  loginFields.style.display = 'block';
});

// Auth actions
signupBtn.addEventListener('click', () => {
  const email = document.getElementById('signup-email').value;
  const pass  = document.getElementById('signup-password').value;
  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => alert('Account created!'))
    .catch(e => alert('Sign up error: ' + e.message));
});

loginAuthBtn.addEventListener('click', () => {
  const email = document.getElementById('login-email').value;
  const pass  = document.getElementById('login-password').value;
  signInWithEmailAndPassword(auth, email, pass)
    .then(() => alert('Logged in!'))
    .catch(e => alert('Login error: ' + e.message));
});

logoutBtn.addEventListener('click', () => signOut(auth));

// Auth observer
onAuthStateChanged(auth, user => {
  if (user) {
    authModal.style.display = 'none';
    logoutBtn.style.display = 'block';
    isAdmin = (user.email === 'houseofforgottendreams@yahoo.com');
    document.getElementById('admin-panel').style.display = isAdmin ? 'block' : 'none';
    document.getElementById('item-form').style.display = isAdmin ? 'block' : 'none';
    fetchItems();
  } else {
    logoutBtn.style.display = 'none';
    isAdmin = false;
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('item-form').style.display = 'none';
  }
});

// Auction logic
const renderItems = items => {
  const container = document.getElementById('auctions-container');
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'auction-item';
    div.innerHTML = `
      ${isAdmin ? '<button class="remove-btn">X</button>' : ''}
      <img src="${item.img}" alt="${item.title}">
      <div class="auction-item-content">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <p>Starting bid: $${item.price}</p>
        <a class="btn" href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=houseofforgottendreams@yahoo.com&item_name=${encodeURIComponent(item.title)}&amount=${item.price}&currency_code=USD">Buy Now</a>
      </div>`;
    container.appendChild(div);

    if (isAdmin) {
      div.querySelector('.remove-btn').addEventListener('click', () => {
        if (confirm('Delete this item?')) {
          remove(ref(db, `auctionItems/${item.id}`))
            .then(() => div.remove())
            .catch(err => alert('Error: ' + err.message));
        }
      });
    }
  });
};

const fetchItems = () => {
  get(itemsRef).then(snap => {
    const data = snap.val() || {};
    renderItems(Object.values(data));
  });
};

onValue(itemsRef, () => fetchItems());

document.addEventListener('DOMContentLoaded', () => {
  fetchItems();
  document.getElementById('add-item').onclick = () => {
    const title = document.getElementById('item-title').value.trim();
    const desc = document.getElementById('item-desc').value.trim();
    const price = document.getElementById('item-price').value.trim();
    const file = document.getElementById('item-img-file').files[0];
    if (!title || !desc || !price || !file) return alert('Fill all fields + upload image');
    const reader = new FileReader();
    reader.onload = () => {
      const id = Date.now();
      set(ref(db, `auctionItems/${id}`), { id, title, desc, price, img: reader.result })
        .then(() => fetchItems())
        .catch(err => alert('Save error: ' + err.message));
    };
    reader.readAsDataURL(file);
  };
});
