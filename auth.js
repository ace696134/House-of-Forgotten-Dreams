
// Firebase configuration (imported from existing config file)
firebase.initializeApp(firebaseConfig);

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
      window.location.reload();
    });
  });
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});
