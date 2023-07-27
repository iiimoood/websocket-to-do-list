import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
  };

  const removeTask = (id) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
    socket.emit('removeTask', id);
  };

  const submitForm = (e) => {
    e.preventDefault();
    addTask({ name: taskName, id: uuidv4() });
    socket.emit('addTask', { name: taskName, id: uuidv4() });
    setTaskName('');
  };

  useEffect(() => {
    const correctSocket = io('ws://localhost:8000', { transports: ["websocket"] });
    setSocket(correctSocket);

    correctSocket.on('removeTask', (id) => removeTask(id));
  }, []);

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li className="task" key={task.id}>
              {task.name}{' '}
              <button className="btn btn--red" onClick={removeTask(task.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
