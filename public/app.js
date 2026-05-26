const API = "http://localhost:3000";

// REGISTER
async function register() {

  const username =
    document.getElementById("regUsername").value;

  const password =
    document.getElementById("regPassword").value;

  const response = await fetch(
    `${API}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }
  );

  const data = await response.json();

  document.getElementById("message")
    .innerText = data.message;
}

// LOGIN
async function login() {

  const username =
    document.getElementById("loginUsername").value;

  const password =
    document.getElementById("loginPassword").value;

  const response = await fetch(
    `${API}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    }
  );

  const data = await response.json();

  if (data.token) {

    localStorage.setItem(
      "token",
      data.token
    );

    window.location.href =
      "/dashboard.html";

  } else {

    document.getElementById("message")
      .innerText = data.message;
  }
}
