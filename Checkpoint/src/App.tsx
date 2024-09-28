import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  interface Todo {
    id: number;
    title: string;
    description: string;
    isComplete: boolean;
    targetId: number;
  }

  interface Target {
    id: number;
    title: string;
    description: string;
    isComplete: boolean;
    todos: Todo[];
  }

  const baseUrl = "https://todo-caio.azurewebsites.net/api/";
  const [targets, setTargets] = useState<Target[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTarget, setNewTarget] = useState({ title: "", description: "" });
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    targetId: 0,
  });
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const requestBase = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Fetch targets and todos
  const getData = async () => {
    try {
      console.log("Fetching targets and todos...");
      const targetsResponse = await requestBase.get("Targets");
      const todosResponse = await requestBase.get("Todo");
      setTargets(targetsResponse.data);
      setTodos(todosResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const postTarget = async () => {
    try {
      console.log("Posting new target:", newTarget);
      const response = await requestBase.post("Targets", {
        title: newTarget.title,
        description: newTarget.description,
        isComplete: false,
        todos: [],
      });
      setTargets([...targets, response.data]);
      setNewTarget({ title: "", description: "" }); // Reset input fields
    } catch (error) {
      console.error("Error posting target:", error);
    }
  };

  const postTodo = async () => {
    try {
      console.log("Posting new todo:", newTodo);
      const response = await requestBase.post("Todo", {
        title: newTodo.title,
        description: newTodo.description,
        isComplete: false,
        targetId: newTodo.targetId,
      });
      setTodos([...todos, response.data]);
      setNewTodo({ title: "", description: "", targetId: 0 }); // Reset input fields
    } catch (error) {
      console.error("Error posting todo:", error);
    }
  };

  const deleteTarget = async (id: number) => {
    try {
      console.log(`Deleting target with id: ${id}`);
      await requestBase.delete(`Targets/${id}`);
      setTargets(targets.filter((target) => target.id !== id));
    } catch (error) {
      console.error(`Error deleting target with id: ${id}`, error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      console.log(`Deleting todo with id: ${id}`);
      await requestBase.delete(`Todo/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(`Error deleting todo with id: ${id}`, error);
    }
  };

  const updateTarget = async (id: number, updatedTarget: Target) => {
    try {
      console.log(`Updating target with id: ${id}`);
      const response = await requestBase.put(`Targets/${id}`, updatedTarget);
      setTargets(
        targets.map((target) => (target.id === id ? response.data : target))
      );
      setEditingTarget(null); // Exit edit mode
    } catch (error) {
      console.error(`Error updating target with id: ${id}`, error);
    }
  };

  const updateTodo = async (id: number, updatedTodo: Todo) => {
    try {
      console.log(`Updating todo with id: ${id}`);
      const response = await requestBase.put(`Todo/${id}`, updatedTodo);
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      setEditingTodo(null); // Exit edit mode
    } catch (error) {
      console.error(`Error updating todo with id: ${id}`, error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="Main">
      <h1>Api TODOs</h1>

      <h2>TARGETS</h2>
      <input
        type="text"
        placeholder="Digite o titulo aqui..."
        value={newTarget.title}
        onChange={(e) => setNewTarget({ ...newTarget, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Descrição"
        value={newTarget.description}
        onChange={(e) =>
          setNewTarget({ ...newTarget, description: e.target.value })
        }
      />
      <button onClick={postTarget}>Add Target</button>

      <h2>TODOs</h2>
      <input
        type="text"
        placeholder="Digite o titulo aqui..."
        value={newTodo.title}
        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Descrição"
        value={newTodo.description}
        onChange={(e) =>
          setNewTodo({ ...newTodo, description: e.target.value })
        }
      />
      <select
        value={newTodo.targetId}
        onChange={(e) =>
          setNewTodo({ ...newTodo, targetId: parseInt(e.target.value) })
        }
      >
        <option value={0}>Select Target</option>
        {targets.map((target) => (
          <option key={target.id} value={target.id}>
            {target.title}
          </option>
        ))}
      </select>
      <button onClick={postTodo}>Add Todo</button>

      <h2>TARGETS</h2>
      {targets.map((target) => (
        <div key={target.id}>
          {editingTarget && editingTarget.id === target.id ? (
            <>
              <input
                type="text"
                value={editingTarget.title}
                onChange={(e) =>
                  setEditingTarget({
                    ...editingTarget,
                    title: e.target.value,
                  })
                }
              />
              <input
                type="text"
                value={editingTarget.description}
                onChange={(e) =>
                  setEditingTarget({
                    ...editingTarget,
                    description: e.target.value,
                  })
                }
              />
              <button onClick={() => updateTarget(target.id, editingTarget)}>
                Salvar Target
              </button>
              <button onClick={() => setEditingTarget(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>
                {target.title} (ID: {target.id})
              </h3>
              <p>{target.description}</p>
              <button onClick={() => setEditingTarget(target)}>
                Editar Target
              </button>
              <button onClick={() => deleteTarget(target.id)}>
                Deletar Target
              </button>
            </>
          )}
        </div>
      ))}

      <h2>TODOs</h2>
      {todos.map((todo) => (
        <div key={todo.id}>
          {editingTodo && editingTodo.id === todo.id ? (
            <>
              <input
                type="text"
                value={editingTodo.title}
                onChange={(e) =>
                  setEditingTodo({ ...editingTodo, title: e.target.value })
                }
              />
              <input
                type="text"
                value={editingTodo.description}
                onChange={(e) =>
                  setEditingTodo({
                    ...editingTodo,
                    description: e.target.value,
                  })
                }
              />
              <select
                value={editingTodo.targetId}
                onChange={(e) =>
                  setEditingTodo({
                    ...editingTodo,
                    targetId: parseInt(e.target.value),
                  })
                }
              >
                <option value={0}>Select Target</option>
                {targets.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.title}
                  </option>
                ))}
              </select>
              <button onClick={() => updateTodo(todo.id, editingTodo)}>
                Salvar Todo
              </button>
              <button onClick={() => setEditingTodo(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h3>
                {todo.title} (ID: {todo.id})
              </h3>
              <p>{todo.description}</p>
              <p>
                Target ID:{" "}
                {targets.find((target) => target.id === todo.targetId)?.title}
              </p>
              <button onClick={() => setEditingTodo(todo)}>Editar Todo</button>
              <button onClick={() => deleteTodo(todo.id)}>Deletar Todo</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
