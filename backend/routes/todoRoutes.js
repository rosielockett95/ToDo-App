const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");

const { protect } = require("../middleware/auth");

// GET all todos
router.get("/", protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new todo
router.post("/", protect, async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
      completed: false,
      user: req.user.id,
    });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) todo
router.put("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorised" });
    }

    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (update one or more fields of a todo)
router.patch("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, text } = req.body;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorised" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { ...(completed !== undefined && { completed }), ...(text && { text }) },
      { new: true },
    );

    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE all completed todos
router.delete("/completed", protect, async (req, res) => {
  try {
    const result = await Todo.deleteMany({
      completed: true,
      user: req.user.id,
    });

    res.json({
      message: "Completed todos deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE todo
router.delete("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    // Check if todo exists
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorised" });
    }

    await todo.deleteOne();

    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
