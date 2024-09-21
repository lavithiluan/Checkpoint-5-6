import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

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
  }

  const baseUrl = 'https://todo-caio.azurewebsites.net/api/';
  const [targets, setTargets] = useState<Target[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTarget, setNewTarget] = useState({ title: '', description: '' });
  const [newTodo, setNewTodo] = useState({ title: '', description: '', targetId: 0 });

  const requestBase = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const getData = async () => {
    try {
      console.log('Fetching targets...');
      const response = await requestBase.get('Targets');
      console.log('Targets fetched:', response.data);
      setTargets(response.data);
    } catch (error) {
      console.error('Error fetching targets:', error);
    }
  };

  const postTarget = async () => {
    try {
      console.log('Posting new target:', newTarget);
      const response = await requestBase.post('Targets', {
        title: newTarget.title,
        description: newTarget.description,
        isComplete: false,
        todo: [],
      });
      console.log('New target added:', response.data);
      setTargets([...targets, response.data]);
      setNewTarget({ title: '', description: '' }); // Reset input fields
    } catch (error) {
      console.error('Error posting target:', error);
    }
  };

  const postTodo = async () => {
    try {
      console.log('Posting new todo:', newTodo);
      const response = await requestBase.post('Todo', {
        title: newTodo.title,
        description: newTodo.description,
        isComplete: false,
        targetId: newTodo.targetId,
      });
      console.log('New todo added:', response.data);
      setTodos([...todos, response.data]);
      setNewTodo({ title: '', description: '', targetId: 0 }); // Reset input fields
    } catch (error) {
      console.error('Error posting todo:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h1>Todo App</h1>

      <h2>Add Target</h2>
      <input
        type="text"
        placeholder="Title"
        value={newTarget.title}
        onChange={(e) => {
          console.log('Target title changed:', e.target.value);
          setNewTarget({ ...newTarget, title: e.target.value });
        }}
      />
      <input
        type="text"
        placeholder="Description"
        value={newTarget.description}
        onChange={(e) => {
          console.log('Target description changed:', e.target.value);
          setNewTarget({ ...newTarget, description: e.target.value });
        }}
      />
      <button onClick={postTarget}>Add Target</button>

      <h2>Add Todo</h2>
      <input
        type="text"
        placeholder="Title"
        value={newTodo.title}
        onChange={(e) => {
          console.log('Todo title changed:', e.target.value);
          setNewTodo({ ...newTodo, title: e.target.value });
        }}
      />
      <input
        type="text"
        placeholder="Description"
        value={newTodo.description}
        onChange={(e) => {
          console.log('Todo description changed:', e.target.value);
          setNewTodo({ ...newTodo, description: e.target.value });
        }}
      />
      <input
        type="number"
        placeholder="Target ID"
        value={newTodo.targetId}
        onChange={(e) => {
          console.log('Target ID changed:', e.target.value);
          setNewTodo({ ...newTodo, targetId: Number(e.target.value) });
        }}
      />
      <button onClick={postTodo}>Add Todo</button>

      <h2>Targets</h2>
      <ul>
        {targets.map((target) => (
          <li key={target.id}>
            {target.title}: {target.description}
          </li>
        ))}
      </ul>

      <h2>Todos</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title} (Target ID: {todo.targetId}): {todo.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
