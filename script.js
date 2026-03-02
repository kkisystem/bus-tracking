// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYJLKSwalpASb6WHxy10ZpU8wj3K14pwA",
  authDomain: "bus-tracking-system-450df.firebaseapp.com",
  projectId: "bus-tracking-system-450df",
  storageBucket: "bus-tracking-system-450df.appspot.com",
  messagingSenderId: "355099052252",
  appId: "1:355099052252:web:ff395c9a4a226bd3684c19"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Convert phone → fake email
function phoneToEmail(phone) {
  return phone.replace(/[^0-9]/g, "") + "@phone.user";
}

// ✅ Phone validation (EXACTLY 10 digits)
function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

// ---------------- REGISTER ----------------
function register() {
  const phone = document.getElementById("registerPhone").value.trim();
  const pass = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("registerConfirm").value;
  const error = document.getElementById("error");

  error.textContent = "";

  if (!phone || !pass || !confirm) {
    error.textContent = "Please fill all fields";
    return;
  }

  if (!isValidPhone(phone)) {
    error.textContent = "Phone number must be exactly 10 digits";
    return;
  }

  if (pass.length < 6) {
    error.textContent = "Password must be at least 6 characters";
    return;
  }

  if (pass !== confirm) {
    error.textContent = "Passwords do not match";
    return;
  }

  firebase.auth()
    .createUserWithEmailAndPassword(phoneToEmail(phone), pass)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      if (err.code === "auth/email-already-in-use") {
        error.textContent = "This phone number already has an account";
      } else {
        error.textContent = "Something went wrong. Try again.";
      }
    });
}

// ---------------- LOGIN ----------------
function login() {
  const phone = document.getElementById("loginPhone").value.trim();
  const pass = document.getElementById("loginPassword").value;
  const error = document.getElementById("error");

  error.textContent = "";

  if (!phone || !pass) {
    error.textContent = "Please fill all fields";
    return;
  }

  if (!isValidPhone(phone)) {
    error.textContent = "Phone number must be exactly 10 digits";
    return;
  }

  firebase.auth()
    .signInWithEmailAndPassword(phoneToEmail(phone), pass)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(() => {
      error.textContent = "Incorrect phone number or password";
    });
}
// ---------------- LOGOUT ----------------
function logout() {
  firebase.auth().signOut()
    .then(() => {
      window.location.href = "index.html"; // back to login
    })
    .catch(() => {
      alert("Error logging out");
    });
}


// ---------------- LANGUAGE ----------------
function setLang(lang) {
    localStorage.setItem("lang", lang);
  // text content
  document.querySelectorAll("[data-en]").forEach(el => {
    el.textContent = lang === "en" ? el.dataset.en : el.dataset.ar;
  });

  // placeholders
  document.querySelectorAll("[data-en-placeholder]").forEach(el => {
    el.placeholder =
      lang === "en"
        ? el.dataset.enPlaceholder
        : el.dataset.arPlaceholder;
  });

  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  // 🔁 REPLAY HOW-WE-WORK ANIMATION
  const items = document.querySelectorAll(".how-we-work h3, .how-we-work p");

  items.forEach(el => {
    el.style.animation = "none";   // remove animation
    el.offsetHeight;               // force reflow
    el.style.animation = "";       // re-add animation
  });
}

// Apply saved language on load
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "en";
  setLang(savedLang);
});
// 🔐 Protect private pages
firebase.auth().onAuthStateChanged(user => {
  const protectedPages = ["dashboard.html", "map.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage) && !user) {
    window.location.href = "index.html";
  }
});
















