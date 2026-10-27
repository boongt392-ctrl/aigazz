/* AIGAZ - Firebase Authentication */
(() => {
  "use strict";

  const firebaseConfig = {
    apiKey: "AIzaSyCui5BBPQULKq-7V2SrRJsNt8SN1Md_CKs",
    authDomain: "aigaz-bf2d6.firebaseapp.com",
    projectId: "aigaz-bf2d6",
    storageBucket: "aigaz-bf2d6.firebasestorage.app",
    messagingSenderId: "833120814621",
    appId: "1:833120814621:web:0f9dad3dbf8426bd4b28f4",
    measurementId: "G-5M6TNMG27R"
  };

  if (window.AIGAZAuth) return;

  window.AIGAZAuth = {
    ready: false,
    user: null,
    auth: null
  };

  function start() {
    if (!window.firebase) {
      console.error("Firebase SDK belum dimuat.");
      return;
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth();
    window.AIGAZAuth.auth = auth;
    window.AIGAZAuth.ready = true;

    const style = document.createElement("style");
    style.textContent = `
      #gazAuthOverlay {
        position: fixed; inset: 0; z-index: 999999;
        display: flex; align-items: center; justify-content: center;
        overflow-y: auto; padding: 24px;
        background: radial-gradient(ellipse at top, #123b2c, #07100d 55%, #030605);
        color: #f3fff7; font-family: Arial, sans-serif;
      }
      #gazAuthOverlay * { box-sizing: border-box; }
      .gaz-auth-card {
        width: 100%; max-width: 420px; padding: 30px;
        background: rgba(12, 25, 19, .97);
        border: 1px solid #244b35; border-radius: 22px;
        box-shadow: 0 20px 70px #0009;
      }
      .gaz-auth-logo { font-size: 30px; font-weight: 900; letter-spacing: 2px; }
      .gaz-auth-logo span { color: #50f59a; }
      .gaz-auth-sub { color: #a7b8ad; margin: 10px 0 24px; line-height: 1.5; }
      .gaz-auth-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
      .gaz-auth-tabs button, .gaz-auth-btn {
        cursor: pointer; border: 0; border-radius: 10px;
        padding: 12px; font-weight: 700;
      }
      .gaz-auth-tabs button { flex: 1; background: #17251d; color: #c7d7cc; }
      .gaz-auth-tabs button.active, .gaz-auth-btn {
        background: #50f59a; color: #052013;
      }
      .gaz-auth-field { display: block; margin: 13px 0; }
      .gaz-auth-field span { display: block; font-size: 13px; margin-bottom: 7px; color: #c5d5ca; }
      .gaz-auth-field input {
        width: 100%; padding: 13px; border-radius: 10px;
        border: 1px solid #304638; background: #09120d;
        color: white; outline: none;
      }
      .gaz-auth-field input:focus { border-color: #50f59a; }
      .gaz-auth-btn { width: 100%; margin-top: 12px; font-size: 15px; }
      .gaz-auth-google {
        width: 100%; margin-top: 10px; padding: 12px;
        border: 1px solid #3b5143; border-radius: 10px;
        color: white; background: #152219; cursor: pointer;
      }
      .gaz-auth-msg { font-size: 13px; line-height: 1.5; margin-top: 14px; color: #9fffc2; overflow-wrap: anywhere; }
      .gaz-auth-msg.error { color: #ff9b9b; }
      .gaz-auth-foot { color: #7f9687; font-size: 12px; margin-top: 20px; text-align: center; }
      #gazAuthLogout {
        position: fixed; z-index: 99998; right: 16px; bottom: 16px;
        padding: 10px 14px; border-radius: 10px; border: 1px solid #50f59a;
        background: #10251a; color: #50f59a; cursor: pointer;
      }
      @media(max-width:480px) {
        #gazAuthOverlay { padding: 14px; }
        .gaz-auth-card { padding: 23px; }
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "gazAuthOverlay";
    overlay.innerHTML = `
      <section class="gaz-auth-card">
        <div class="gaz-auth-logo">AI<span>GAZ</span></div>
        <p class="gaz-auth-sub">Workspace AI kamu. Masuk atau buat akun untuk melanjutkan.</p>
        <div class="gaz-auth-tabs">
          <button type="button" class="active" data-mode="login">Login</button>
          <button type="button" data-mode="register">Register</button>
        </div>
        <form id="gazAuthForm">
          <label class="gaz-auth-field" id="gazNameField" hidden>
            <span>Nama</span>
            <input id="gazAuthName" autocomplete="name" maxlength="60">
          </label>
          <label class="gaz-auth-field">
            <span>Email</span>
            <input id="gazAuthEmail" type="email" autocomplete="email" required>
          </label>
          <label class="gaz-auth-field">
            <span>Password</span>
            <input id="gazAuthPassword" type="password" minlength="6"
              autocomplete="current-password" required>
          </label>
          <button class="gaz-auth-btn" id="gazAuthSubmit" type="submit">Login</button>
        </form>
        <button class="gaz-auth-google" id="gazAuthGoogle" type="button">
          G  Lanjutkan dengan Google
        </button>
        <button class="gaz-auth-google" id="gazAuthReset" type="button">
          Lupa password?
        </button>
        <div class="gaz-auth-msg" id="gazAuthMessage" role="status"></div>
        <div class="gaz-auth-foot">Jangan bagikan password atau kode verifikasi kepada siapa pun.</div>
      </section>
    `;
    document.body.appendChild(overlay);

    const form = document.getElementById("gazAuthForm");
    const nameField = document.getElementById("gazNameField");
    const nameInput = document.getElementById("gazAuthName");
    const emailInput = document.getElementById("gazAuthEmail");
    const passwordInput = document.getElementById("gazAuthPassword");
    const submit = document.getElementById("gazAuthSubmit");
    const message = document.getElementById("gazAuthMessage");
    let mode = "login";
    let busy = false;

    function showMessage(text, isError = false) {
      message.textContent = text;
      message.classList.toggle("error", isError);
    }

    function setMode(nextMode) {
      mode = nextMode;
      nameField.hidden = mode !== "register";
      nameInput.required = mode === "register";
      passwordInput.autocomplete =
        mode === "register" ? "new-password" : "current-password";
      submit.textContent = mode === "register" ? "Buat Akun" : "Login";

      overlay.querySelectorAll("[data-mode]").forEach(button => {
        button.classList.toggle("active", button.dataset.mode === mode);
      });
      showMessage("");
    }

    overlay.querySelectorAll("[data-mode]").forEach(button => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
    });

    function friendlyError(error) {
      const messages = {
        "auth/email-already-in-use": "Email ini sudah terdaftar. Coba login.",
        "auth/invalid-email": "Format email tidak valid.",
        "auth/weak-password": "Password terlalu lemah. Gunakan minimal 6 karakter.",
        "auth/user-not-found": "Akun tidak ditemukan. Periksa email atau daftar dahulu.",
        "auth/wrong-password": "Password salah.",
        "auth/invalid-credential": "Email atau password salah.",
        "auth/popup-closed-by-user": "Jendela Google ditutup sebelum login selesai.",
        "auth/popup-blocked": "Popup diblokir browser. Izinkan popup lalu coba lagi.",
        "auth/unauthorized-domain": "Domain belum diizinkan di Firebase Authentication.",
        "auth/operation-not-allowed": "Metode login belum diaktifkan di Firebase Console.",
        "auth/network-request-failed": "Koneksi internet bermasalah. Coba lagi."
      };
      return messages[error.code] || error.message || "Terjadi kesalahan. Coba lagi.";
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (busy) return;
      busy = true;
      submit.disabled = true;
      showMessage("Memproses akun...");

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      try {
        if (mode === "register") {
          const credential = await auth.createUserWithEmailAndPassword(email, password);
          if (nameInput.value.trim()) {
            await credential.user.updateProfile({
              displayName: nameInput.value.trim()
            });
          }
          await credential.user.sendEmailVerification();
          await auth.signOut();
          setMode("login");
          emailInput.value = email;
          passwordInput.value = "";
          showMessage("Akun berhasil dibuat! Buka Gmail, klik tautan verifikasi, lalu login kembali.");
        } else {
          const credential = await auth.signInWithEmailAndPassword(email, password);
          if (!credential.user.emailVerified) {
            await credential.user.sendEmailVerification();
            await auth.signOut();
            showMessage("Email belum terverifikasi. Tautan verifikasi baru sudah dikirim ke email kamu.", true);
          }
        }
      } catch (error) {
        showMessage(friendlyError(error), true);
      } finally {
        busy = false;
        submit.disabled = false;
      }
    });

    document.getElementById("gazAuthGoogle").addEventListener("click", async () => {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await auth.signInWithPopup(provider);
      } catch (error) {
        showMessage(friendlyError(error), true);
      }
    });

    document.getElementById("gazAuthReset").addEventListener("click", async () => {
      const email = emailInput.value.trim();
      if (!email) {
        showMessage("Masukkan alamat email dahulu, lalu klik Lupa password.", true);
        return;
      }
      try {
        await auth.sendPasswordResetEmail(email);
        showMessage("Tautan reset password sudah dikirim jika email terdaftar. Periksa Gmail.");
      } catch (error) {
        showMessage(friendlyError(error), true);
      }
    });

    const logoutButton = document.createElement("button");
    logoutButton.id = "gazAuthLogout";
    logoutButton.textContent = "Logout";
    logoutButton.hidden = true;
    logoutButton.addEventListener("click", async () => {
      await auth.signOut();
    });
    document.body.appendChild(logoutButton);

    auth.onAuthStateChanged(async user => {
      window.AIGAZAuth.user = user || null;

      if (user && user.emailVerified) {
        overlay.remove();
        logoutButton.hidden = false;
      } else {
        logoutButton.hidden = true;
        if (!document.getElementById("gazAuthOverlay")) {
          document.body.appendChild(overlay);
        }

        if (user && !user.emailVerified) {
          try {
            await auth.signOut();
          } catch {}
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();