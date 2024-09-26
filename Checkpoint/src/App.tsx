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

  const deleteTarget = async (id: number) => {
    try {
      console.log('Deleting target with id:', id);
      await requestBase.delete(`Targets/${id}`);
      setTargets(targets.filter(target => target.id !== id));
    } catch (error) {
      console.error('Error deleting target:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      console.log('Deleting todo with id:', id);
      await requestBase.delete(`Todo/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='Main'>
      <h1>CheckPoint</h1>
  
      <h2>Target</h2>
      <input
        type="text"
        placeholder="Title"
        value={newTarget.title}
        onChange={(e) => setNewTarget({ ...newTarget, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newTarget.description}
        onChange={(e) => setNewTarget({ ...newTarget, description: e.target.value })}
      />
      <button onClick={postTarget}>Add Target</button>
  
      <h2>Todo</h2>
      <input
        type="text"
        placeholder="Title"
        value={newTodo.title}
        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newTodo.description}
        onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Target ID"
        value={newTodo.targetId}
        onChange={(e) => setNewTodo({ ...newTodo, targetId: parseInt(e.target.value) })}
      />
      <button onClick={postTodo}>Add Todo</button>

      <h2>Targets</h2>
      {targets.map((target) => (
        <div key={target.id}>
          <h3>{target.title}</h3>
          <p>{target.description}</p>
          <button onClick={() => deleteTarget(target.id)}>Delete Target</button>
        </div>
      ))}
  
      <h2>Todos</h2>
      {todos.map((todo) => (
        <div key={todo.id}>
          <h3>{todo.title} (ID: {todo.id})</h3>
          <p>{todo.description}</p>
          <button onClick={() => deleteTodo(todo.id)}>Delete Todo</button>
        </div>
      ))}
      </div>
  );
}

export default App;
