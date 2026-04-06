const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");
const submitButton = document.querySelector(".submit-btn");

// const slowLoadTimer = setTimeout(() => {
//   note.classList.remove("hidden");
// }, 4000);

// // When the app is ready
// function onAppReady() {
//   clearTimeout(slowLoadTimer);
//   document.getElementById("app-loading").style.display = "none";
// }

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ⭐ critical
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    // onAppReady();

    console.log("form submitted");

    submitButton.addEventListener("click", () => {
      submitButton.textContent = "Logging in...";
    });

    if (!res.ok) {
      throw new Error(data.message);
    }

    // Redirect after login

    window.location.href = "http://127.0.0.1:5502/frontend/html/index.html";
  } catch (err) {
    errorEl.textContent = err.message;
  }
});
