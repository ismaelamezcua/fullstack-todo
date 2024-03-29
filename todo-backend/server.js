const express = require("express");
const cors = require("cors");
const app = express();

// Check whether the port number is provided or use 3000 as default.
const port = process.env.PORT || 3000;

// For using JSON in requests and responses.
app.use(express.json());
app.use(cors());

// Placeholder ToDos. Will store them in a DB later.
let todos = [{id: 1, text: "This is the First ToDo", done: false}, {id: 2, text: "This is the second ToDo", done: true}];

// GET all ToDos.
app.get("/api/v1/todos", (req, res) => {
  // res.send(JSON.stringify(todos));
  res.json(todos);
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

  // Create a new ToDo object.
  let newTodo = { id: Date.now(), text, done: false };

  // Store the new ToDo object. Will store in DB later.
  todos.push(newTodo);

  res.json(newTodo);
});

// Update a ToDo.
app.put("/api/v1/todos/:id", (req, res) => {
  // Get the id from the params in the request URI (:id)
  const { id } = req.params;
  // Get the done state from the request body
  const { done } = req.body;

  // Update the ToDo with :id in the array.
  todos = todos.map((todo) => ({
    ...todo,
    done: todo.id == id ? done : todo.done,
  }));

  // Get the updated ToDo with :id
  let todo = todos.find((todo) => todo.id == id);

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
