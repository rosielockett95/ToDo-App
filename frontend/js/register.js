const form = document.getElementById("registerForm");
const errorEl = document.getElementById("error");
const submitButton = document.querySelector(".submit-btn");

const slowLoadTimer = setTimeout(() => {
  note.classList.remove("hidden");
}, 4000);

// When the app is ready
function onAppReady() {
  clearTimeout(slowLoadTimer);
  document.getElementById("app-loading").style.display = "none";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    // onAppReady();

    submitButton.addEventListener("click", () => {
      submitButton.textContent = "Registering...";
    });

    if (!res.ok) {
      throw new Error(data.message);
    }

    // Redirect after successful register
    window.location.href = "http://127.0.0.1:5502/frontend/html/login.html";
  } catch (err) {
    errorEl.textContent = err.message;
  }
});
