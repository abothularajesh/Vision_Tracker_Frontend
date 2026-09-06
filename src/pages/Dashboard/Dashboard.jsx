
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import api from "../../api/api.js";

import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);

    const [todos, setTodos] = useState([]);

    const [loading, setLoading] = useState(true);
    const [todosLoading, setTodosLoading] = useState(true);

    const [error, setError] = useState("");

    const [showAllTodos, setShowAllTodos] = useState(false);


    const loginStreak =
        Number(localStorage.getItem("loginStreak")) || 0;

    const username = localStorage.getItem("username");

    const newName = username
        ? username.split("@")[0]
        : "User";


    /*
     * GET DASHBOARD DATA
     */
    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response = await api.get("/dashboard");

                setDashboard(response.data);

            } catch (error) {

                console.error(
                    "Dashboard API error:",
                    error
                );

                setError(
                    "Unable to load dashboard data."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchDashboard();

    }, []);


    /*
     * GET TODO TASKS
     *
     * Read-only.
     */
    useEffect(() => {

        const fetchTodos = async () => {

            try {

                setTodosLoading(true);

                const response =
                    await api.get("/todos");

                setTodos(response.data || []);

            } catch (error) {

                console.error(
                    "Todo API error:",
                    error
                );

            } finally {

                setTodosLoading(false);

            }
        };

        fetchTodos();

    }, []);


    /*
     * Tasks displayed on dashboard
     */
    const displayedTodos = showAllTodos
        ? todos
        : todos.slice(0, 5);


    if (loading) {

        return (

            <div className="dashboard">

                <Sidebar />

                <div className="dashboard-main">

                    <Navbar />

                    <main className="dashboard-content">

                        <p>
                            Loading dashboard...
                        </p>

                    </main>

                </div>

            </div>
        );
    }


    if (error) {

        return (

            <div className="dashboard">

                <Sidebar />

                <div className="dashboard-main">

                    <Navbar />

                    <main className="dashboard-content">

                        <p>{error}</p>

                    </main>

                </div>

            </div>
        );
    }


    return (

        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-main">

                <Navbar />

                <main className="dashboard-content">

                    {/* Welcome */}

                    <section className="welcome-section">

                        <h1>
                            Welcome back,{" "}
                            {dashboard?.newName ||
                                newName ||
                                "User"} 👋
                        </h1>

                        <p>
                            Track your goals, tasks and
                            progress from one place.
                        </p>

                    </section>


                    {/* Statistics */}

                    <section className="stats-grid">

                        <div className="stat-card">

                            <span className="stat-title">
                                Total Goals
                            </span>

                            <strong className="stat-value">
                                {dashboard?.totalGoals ?? 0}
                            </strong>

                        </div>


                        <div className="stat-card">

                            <span className="stat-title">
                                Completed Tasks
                            </span>

                            <strong className="stat-value">
                                {dashboard?.completedTasks ?? 0}
                            </strong>

                        </div>


                        <div className="stat-card">

                            <span className="stat-title">
                                Progress
                            </span>

                            <strong className="stat-value">
                                {(dashboard?.overallProgress ?? 0).toFixed(0)}%
                            </strong>

                        </div>


                        <div className="stat-card">

                            <span className="stat-title">
                                Current Streak
                            </span>

                            <strong className="stat-value">
                                {loginStreak} 🔥
                            </strong>

                        </div>

                    </section>


                    {/* Dashboard Panels */}

                    <section className="dashboard-panels">

                        {/* Today's Tasks */}

                        <div className="dashboard-panel tasks-panel">

                            <div className="panel-header">

                                <div>

                                    <h3>
                                        Today's Tasks
                                    </h3>

                                    <p>
                                        Your todo tasks
                                    </p>

                                </div>


                                {todos.length > 5 && (

                                    <button
                                        className="view-all-btn"
                                        onClick={() =>
                                            setShowAllTodos(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                    >

                                        {showAllTodos
                                            ? "Show Less"
                                            : "View All"}

                                    </button>

                                )}

                            </div>


                            <div className="dashboard-todo-list">

                                {todosLoading ? (

                                    <div className="todo-message">
                                        Loading tasks...
                                    </div>

                                ) : displayedTodos.length === 0 ? (

                                    <div className="todo-message">
                                        No tasks yet
                                    </div>

                                ) : (

                                    displayedTodos.map((todo) => (

                                        <div
                                            className="dashboard-todo-item"
                                            key={todo.id}
                                        >

                                            <span
                                                className={`todo-checkbox ${
                                                    todo.status ===
                                                    "COMPLETED"
                                                        ? "completed"
                                                        : ""
                                                }`}
                                            >

                                                {todo.status ===
                                                "COMPLETED"
                                                    ? "✓"
                                                    : "□"}

                                            </span>


                                            <div className="todo-info">

                                                <span className="todo-title">
                                                    {todo.title}
                                                </span>

                                                {todo.description && (

                                                    <span className="todo-description">
                                                        {todo.description}
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    ))

                                )}

                            </div>

                        </div>


                        {/* VT Assistant */}

                        <div className="dashboard-panel assistant-panel">

                            <div className="assistant-icon">
                                🤖
                            </div>

                            <h3>
                                VT Assistant
                            </h3>

                            <p>
                                Your AI assistant.
                                Track goals, tasks and
                                progress with ease.
                            </p>

                            <button
                                className="assistant-btn"
                                onClick={() =>
                                    navigate("/assistant")
                                }
                            >
                                Open Assistant
                            </button>

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default Dashboard;

