require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const colors = require("colors");
const cors = require("cors");
const Todo = require("./models/Todo");
const todoRoutes = require("./routes/todoRoutes");

app.use(cors());
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
