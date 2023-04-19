const express = require("express");
const app = express();

// Check whether the port number is provided or use 3000 as default.
const port = process.env.PORT || 3000;

// For using JSON in requests and responses.
app.use(express.json());

// Placeholder ToDos. Will store them in a DB later.
let todos = [
  { id: 1, text: "First todo", done: false },
  { id: 2, text: "Second todo", done: true },
];

// GET all ToDos.
app.get("/api/v1/todos", (req, res) => {
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

  // Create a new ToDo object.
  let newTodo = { id: Date.now(), text, done: false };

  // Store the new ToDo object. Will store in DB later.
  todos.push(newTodo);

  res.json(newTodo);
});

// Start the server by listening on defined port.
app.listen(port, () => {
  console.log("Server running on port", port);
});
