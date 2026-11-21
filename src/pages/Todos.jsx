import { useState, useRef } from 'react'
import { useFetch } from '../hooks/useFetch'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'

export function Todos() {

    const { email, logout } = useAuth()
    const [tasks, setTasks] = useState([])
    const [input, setInput] = useState('')
    const [update, setUpdate] = useState(null)
    const inputRef = useRef(null)

    const [isloading, error, refetch] = useFetch('/tasks', setTasks)

    async function submit(e) {
        e.preventDefault()
        const taskMessage = input.trim()
        if (!taskMessage) return
        const previous = tasks

        try {
            if (update === null) {
                const tempId = `temp-${Date.now()}`
                setTasks([...tasks, { id: tempId, message: taskMessage }])
                const { data: newTask } = await api.post('/tasks', { message: taskMessage })
                setTasks((cur) => cur.map((t) => (t.id === tempId ? newTask : t)))
            } else {
                const id = update
                setUpdate(null)
                setTasks(tasks.map((t) => (t.id === id ? { ...t, message: taskMessage } : t)))
                await api.put(`/tasks/${id}`, { message: taskMessage })
            }
        } catch {
            setTasks(previous)
            alert('Could not save. Please try again.')
        }
        setInput('')
    }

    async function deleteTask(id) {
        if (update === id) {
            setUpdate(null)
            setInput('')
        }

        const previous = tasks
        setTasks(tasks.filter((t) => t.id !== id))
        try {
            await api.delete(`/tasks/${id}`)
        } catch {
            setTasks(previous)
            alert('Could not delete. Please try again.')
        }
    }

    function updateTask(id, message) {
        setUpdate(id)
        setInput(message)
        inputRef.current?.focus()
    }

    if (error) {
        return (
            <div className="app-container">
                <h2>Something went wrong</h2>
                <div className="error-actions">
                    <button className="refresh-btn" onClick={refetch}>Try again</button>
                    <button className="refresh-btn" onClick={logout}>Logout</button>
                </div>
            </div>
        )
    }
    if (isloading && tasks.length === 0) return <h2>Loading tasks...</h2>

    return (
        <div className="app-container">
            <div className="header-row">
                <div className="title-block">
                    <h1>To-Do List</h1>
                    <p className="user-email">{email}</p>
                </div>
                <div className="user-bar">
                    <button onClick={refetch} disabled={isloading} className="refresh-btn" title="Refresh">
                        {isloading ? '...' : '⟳'}
                    </button>
                    <button onClick={logout} className="refresh-btn logout-btn">Logout</button>
                </div>
            </div>

            <form onSubmit={submit}>
                <input
                    ref={inputRef}
                    type="text"
                    name="task"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your task"
                />
                <button type="submit">{update === null ? 'Add' : 'Update'}</button>
            </form>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <span>{task.message}</span>
                        <div className="btn-group">
                            <button className="edit-btn" onClick={() => updateTask(task.id, task.message)}>edit</button>
                            <button className="delete-btn" onClick={() => deleteTask(task.id)}>delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}