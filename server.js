const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("./config");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const USERS_FILE = "./users.json";

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();

  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username,
    password: hashedPassword
  });

  saveUsers(users);

  res.json({
    message: "Registration successful"
  });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign(
    { username: user.username },
    config.SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token
  });
});

// PROTECTED ROUTE
app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      config.SECRET_KEY
    );

    res.json({
      message: "Protected data",
      user: decoded
    });

  } catch (err) {
    res.status(401).json({
      message: "Invalid token"
    });
  }
});

app.listen(config.PORT, () => {
  console.log(
    `Server running on http://localhost:${config.PORT}`
  );
});
