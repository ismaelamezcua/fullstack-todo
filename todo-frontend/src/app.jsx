import { useState, useEffect } from "react";
import ListTodos from "./components/list-todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [updateTodos, setUpdateTodos] = useState(false);

  async function getTodos() {
    const response = await fetch("http://localhost:3000/api/v1/todos");
    const todos = await response.json();

    setTodos(todos);
  }

  useEffect(() => {
    getTodos();
  }, [updateTodos]);

  function handleSubmit(event) {
    event.preventDefault();

    if (todo.length <= 0) return;

    // Do the POST and then issue an update
    fetch("http://localhost:3000/api/v1/todos", {
      method: "POST",
      body: JSON.stringify({ text: todo }),
      headers: {
        "Content-type": "application/json",
      },
    }).then(setUpdateTodos(!updateTodos));

    setTodo("");
  }

  function handleCheckbox(event) {
    const { name, checked } = event.target;

    fetch(`http://localhost:3000/api/v1/todos/${name}`, {
      method: "PUT",
      body: JSON.stringify({ done: checked }),
      headers: {
        "Content-type": "application/json",
      },
    });

    setUpdateTodos(!updateTodos);
  }

  function handleRemove() {
    fetch("http://localhost:3000/api/v1/todos", {
      method: "DELETE",
    }).then(setUpdateTodos(!updateTodos));
  }

  return (
    <div className="container mx-auto max-w-2xl my-8">
      <h1 className="text-4xl font-bold text-center mb-4">ToDo App</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full px-4 py-2 border border-slate-500"
          name="text"
          value={todo}
          placeholder="Add new ToDo"
          onChange={(e) => setTodo(e.target.value)}
        />
      </form>
      <ListTodos todos={todos} handleCheckbox={handleCheckbox} />
      <div className="flex justify-end my-4">
        <button
          className="bg-slate-800 px-4 py-2 text-white"
          onClick={handleRemove}
        >
          Remove done ToDos
        </button>
      </div>
    </div>
  );
}

export default App;
