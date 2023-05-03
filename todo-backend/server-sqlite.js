const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const app = express();
const db = new Database("todos.db", { verbose: console.log });

// Check whether the port number is provided or use 3000 as default.
const port = process.env.PORT || 3000;

// For using JSON in requests and responses.
app.use(express.json());
app.use(cors());

// Create the database structure
db.exec(
  "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL, done INTEGER)"
);

// GET all ToDos.
app.get("/api/v1/todos", (req, res) => {
  const todos = db.prepare("SELECT * FROM todos WHERE done = 0").all();

  res.send(JSON.stringify(todos));
});

// POST a new ToDo.
app.post("/api/v1/todos", (req, res) => {
  // Check whether the request has a "text" variable in the body.
  const { text } = req.body;

  if (typeof text === "undefined" || !text) {
    const message = "ERROR: POST /api/v1/todos -> No 'text' parameter in body.";
    console.error(message);

    // Tell the client that an error just occured.
    res.status(400).json({ message });

    // Required for leaving the function handler.
    return;
  }

  // Insert a new ToDo into the DB.
  const stmt = db.prepare("INSERT INTO todos (text, done) VALUES (?, 0)");
  const newTodo = stmt.run(text);

  // Get the ToDo we just created.
  const todo = db
    .prepare("SELECT * FROM todos WHERE id = ?")
    .get(newTodo.lastInsertRowid);

  res.json(todo);
});

// Update a ToDo.
app.put("/api/v1/todos/:id", (req, res) => {
  // Get the id from the params in the request URI (:id).
  const { id } = req.params;
  // Get the done state from the request body.
  const { done } = req.body;

  // Update the ToDo with {id} with {done}.
  const stmt = db.prepare("UPDATE todos SET done = ? WHERE id = ?");
  const result = stmt.run(done ? 1 : 0, id);

  // Get the ToDo we just updated.
  const todo = db
    .prepare("SELECT * FROM todos WHERE id = ?")
    .get(result.lastInsertRowid);

  res.json(todo);
});

// Remove ToDo with :id.
app.delete("/api/v1/todos/:id", (req, res) => {
  const { id } = req.params;
  todos = todos.filter((todo) => !todo.id == id);

  // Send a response with a 204 No content
  res.status(204).json({});
});

// Remove all done ToDos.
app.delete("/api/v1/todos", (req, res) => {
  todos = todos.filter((todo) => !todo.done);

  // Send a response with a 204 No content
  res.status(204).json({});
});

// Start the server by listening on defined port.
app.listen(port, () => {
  console.log("Server running on port", port);
});

module.exports = app;
