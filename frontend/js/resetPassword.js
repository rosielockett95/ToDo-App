const sendPasswordResetBtn = document.querySelector("#password-btn");
const passwordForm = document.querySelector("#passwordForm");
const errorEl = document.getElementById("error");

passwordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  try {
    const res = await fetch(
      "https://todo-app-655q.onrender.com/api/auth/forgotpassword",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ⭐ critical
        body: JSON.stringify({ email }),
      },
    );

    const data = await res.json();

    console.log("form submitted");

    if (!res.ok) {
      throw new Error(data.message);
    }
  } catch (err) {
    errorEl.textContent = err.message;
  }
});
