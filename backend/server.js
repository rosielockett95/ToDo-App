require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const Todo = require("./models/Todo");
const todoRoutes = require("./routes/todoRoutes");
const auth = require("./routes/auth");

const cors = require("cors");

const allowedOrigins = [
  "https://genuine-douhua-7899ca.netlify.app",
  "http://localhost:5502",
  "http://127.0.0.1:5502",
];

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["*"],
  }),
);
app.use(express.json());
app.use("/api/todos", todoRoutes);

console.log("MONGO_URI from .env:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ Connected to MongoDB!".yellow))
  .catch((err) => console.error("❌ MongoDB connection error:".red, err));

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`.magenta);
});

app.use("/api/auth", auth);
