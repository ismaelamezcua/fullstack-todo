import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (todo.length <= 0) return;

    let newTodo = { id: Date.now(), text: todo, done: false };
    setTodos([...todos, newTodo]);
    setTodo("");
  }

  function handleCheckbox(event) {
    const { name, checked } = event.target;
    let updatedTodos = todos.map((todo) => ({
      ...todo,
      done: todo.id == name ? checked : todo.done,
    }));

    setTodos(updatedTodos);
  }

  function handleRemove() {
    let updatedTodos = todos.filter((todo) => !todo.done);

    setTodos(updatedTodos);
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
      <ul className="">
        {todos.map((todo) => (
          <li key={todo.id} className="py-2 flex items-center">
            <input
              type="checkbox"
              name={todo.id}
              defaultChecked={todo.done}
              onClick={handleCheckbox}
            />
            <p className="pl-4">{todo.text}</p>
          </li>
        ))}
      </ul>
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
