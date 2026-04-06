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
    const res = await fetch(
      "https://todo-app-655q.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ⭐ critical
        body: JSON.stringify({ email, password }),
      },
    );

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

    window.location.href = "https://genuine-douhua-7899ca.netlify.app/";
  } catch (err) {
    errorEl.textContent = err.message;
  }
});
