import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../api/api.js";
import "./TodoList.css";

function TodoList() {

    const [tasks, setTasks] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");

    // Get Tasks
    const fetchTasks = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await api.get("/todos");

            //console.log("TODO TASKS:", response.data);

            setTasks(response.data);

        } catch (error) {

            console.error("Get todo tasks error:", error);
            setError("Unable to load tasks.");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add Task
    const handleAddTask = async (e) => {

        e.preventDefault();

        if (!taskTitle.trim()) {
            return;
        }

        try {

            setAdding(true);
            setError("");

            const response = await api.post("/todos", {
                title: taskTitle.trim(),
                status: "PENDING"
            });

            //console.log("TODO CREATED:", response.data);

            setTasks((prevTasks) => [
                ...prevTasks,
                response.data
            ]);

            setTaskTitle("");

        } catch (error) {

            console.error("Add todo error:", error);
            setError("Unable to add task.");

        } finally {
            setAdding(false);
        }
    };

    // Update task status
    const handleToggleTask = async (task) => {

        const newStatus =
            task.status === "COMPLETED"
                ? "PENDING"
                : "COMPLETED";

        try {

            const response = await api.put(
                `/todos/${task.id}`,
                {
                    title: task.title,
                    status: newStatus
                }
            );

            //console.log("UPDATED TODO:", response.data);

            setTasks((prevTasks) =>
                prevTasks.map((item) =>
                    item.id === task.id
                        ? {
                            ...item,
                            status: newStatus
                        }
                        : item
                )
            );

        } catch (error) {

            console.error("Update todo error:", error);
            setError("Unable to update task.");
        }
    };

    // Delete task
    const handleDeleteTask = async (id) => {

        try {

            await api.delete(`/todos/${id}`);

            //console.log("TODO DELETED:", id);

            setTasks((prevTasks) =>
                prevTasks.filter(
                    (task) => task.id !== id
                )
            );

        } catch (error) {

            console.error("Delete todo error:", error);
            setError("Unable to delete task.");
        }
    };

    return (
        <div className="todo-page">

            <Sidebar />

            <div className="todo-main">

                <Navbar />

                <main className="todo-content">

                    {/* Header */}
                    <section className="todo-header">

                        <div>
                            <h1>To-Do List</h1>

                            <p>
                                Organize your daily tasks and
                                keep moving forward.
                            </p>
                        </div>

                    </section>

                    {/* Add Task */}
                    <section className="todo-add-section">

                        <form
                            className="todo-add-form"
                            onSubmit={handleAddTask}
                        >

                            <input
                                type="text"
                                placeholder="Add a new task..."
                                value={taskTitle}
                                onChange={(e) =>
                                    setTaskTitle(e.target.value)
                                }
                            />

                            <button
                                type="submit"
                                disabled={
                                    adding ||
                                    !taskTitle.trim()
                                }
                            >
                                {adding ? "Adding..." : "+ Add Task"}
                            </button>

                        </form>

                    </section>

                    {/* Error */}
                    {error && (
                        <div className="todo-error">
                            {error}
                        </div>
                    )}

                    {/* Task list */}
                    <section className="todo-list-section">

                        <div className="todo-list-header">

                            <div>
                                <h2>My Tasks</h2>
                                <p>Tasks you want to complete today.</p>
                            </div>

                            <span className="task-count">
                                {tasks.length}
                            </span>

                        </div>

                        {loading ? (

                            <div className="todo-message">
                                Loading tasks...
                            </div>

                        ) : tasks.length === 0 ? (

                            <div className="todo-empty">

                                <div className="empty-icon">
                                    ✓
                                </div>

                                <h3>No tasks yet</h3>

                                <p>
                                    Add a task above to get started.
                                </p>

                            </div>

                        ) : (

                            <div className="todo-list">

                                {tasks.map((task) => (

                                    <div
                                        className={`todo-item ${
                                            task.status === "COMPLETED"
                                                ? "completed"
                                                : ""
                                        }`}
                                        key={task.id}
                                    >

                                        {/* Custom checkbox */}
                                        <button
                                            type="button"
                                            className="todo-checkbox"
                                            onClick={() =>
                                                handleToggleTask(task)
                                            }
                                            aria-label={
                                                task.status === "COMPLETED"
                                                    ? "Mark task as pending"
                                                    : "Mark task as completed"
                                            }
                                        >
                                            {task.status === "COMPLETED" && (
                                                <span>✓</span>
                                            )}
                                        </button>

                                        {/* Task */}
                                        <div className="todo-task-content">

                                            <span className="todo-task-title">
                                                {task.title}
                                            </span>

                                            <span className="todo-task-status">
                                                {task.status === "COMPLETED"
                                                    ? "Completed"
                                                    : "Pending"}
                                            </span>

                                        </div>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            className="todo-delete"
                                            onClick={() =>
                                                handleDeleteTask(task.id)
                                            }
                                            aria-label="Delete task"
                                            title="Delete task"
                                        >
                                            <span className="delete-icon">
                                                ×
                                            </span>
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                </main>

            </div>

        </div>
    );
}

export default TodoList;