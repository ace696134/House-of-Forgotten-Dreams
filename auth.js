firebase.auth().onAuthStateChanged(user => {
  const authLink = document.getElementById('auth-link');
  const adminSection = document.getElementById('admin-section');
  if (user) {
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.addEventListener("click", e => {
      e.preventDefault();
      firebase.auth().signOut().then(() => location.reload());
    });
    if (user.email === "admin@example.com") {
      adminSection?.classList.remove('hidden');
    }
  } else {
    authLink.textContent = "Login";
    authLink.href = "login.html";
  }
});
