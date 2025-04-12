firebase.auth().onAuthStateChanged((user) => {
  const authLink = document.getElementById('auth-link');
  if (user) {
    authLink.textContent = "Logout";
    authLink.href = "#";
    authLink.onclick = () => firebase.auth().signOut();

    if (user.email === ADMIN_EMAIL) {
      const adminSection = document.getElementById('admin-section');
      if (adminSection) adminSection.style.display = "block";
    }
  } else {
    authLink.textContent = "Login";
    authLink.href = "login.html";
  }
});
