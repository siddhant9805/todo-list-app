import { useState } from 'react'
import './App.css'
import { useFetch } from './hooks/useFetch'

// Backend URL: set VITE_API_URL on Vercel; falls back to local server for dev
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [update, setUpdate] = useState(null)

  // Destructure refetch from the custom hook
  const [isloading, error, refetch] = useFetch(`${API_URL}/tasks`, setTasks)

  async function submit(e) {
    e.preventDefault()
    const taskMessage = e.target.task.value

    if (update === null) {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: taskMessage })
      });
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    }
    else {
      await fetch(`${API_URL}/tasks/${update}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: taskMessage })
      });
      const newtask = tasks.map((task) => {
        if (task.id != update)
          return task

        task.message = taskMessage
        return task
      })

      setTasks(newtask)
      setUpdate(null)
    }
    setInput('')
  }

  async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE"
    });
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function updateTask(id, message) {
    setUpdate(id)
    setInput(message)
  }
   
  if (error) return <h2>Something went wrong</h2>
  if (isloading && tasks.length === 0) return <h2>Loading...</h2>

  return (
    <>
      <div className="app-container">
        <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>To-Do List</h1>
          <button 
            onClick={refetch} 
            disabled={isloading}
            className="refresh-btn"
          >
            {isloading ? "Refreshing..." : "🔄 Refresh"}
          </button>
        </div>

        <form onSubmit={submit}>
          <input 
            type="text" 
            name="task" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Enter your task" 
          />
          <button type="submit">{update === null ? "Add" : "Update"}</button>
        </form>

        <ul>
          {tasks.map((task) => {
            return (
              <li key={task.id}>
                <span>{task.message}</span>
                <div className="btn-group">
                  <button className="edit-btn" onClick={() => updateTask(task.id, task.message)}>edit</button>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)}>delete</button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default App