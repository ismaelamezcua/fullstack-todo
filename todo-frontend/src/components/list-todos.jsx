function ListTodos({ todos, handleCheckbox }) {
  if (todos.length == 0) {
    return <p className="font-bold">No ToDos.</p>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className="py-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name={todo.id}
              defaultChecked={todo.done}
              onClick={handleCheckbox}
            />
            <span className={`pl-4 ${todo.done ? "line-through" : ""}`}>
              {todo.text}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}

export default ListTodos;
