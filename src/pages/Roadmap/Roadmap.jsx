import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import api from "../../api/api.js";

import "./Roadmap.css";


function Roadmap() {

    const { goalId } = useParams();

    const [roadmap, setRoadmap] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [generating, setGenerating] = useState(false);

    const [updatingTaskId, setUpdatingTaskId] = useState(null);


    useEffect(() => {

        fetchRoadmap();

    }, [goalId]);


    const fetchRoadmap = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/goals/${goalId}/roadmap`
            );

            // console.log(
            //     "Roadmap response:",
            //     response.data
            // );

            setRoadmap(response.data);

        } catch (error) {

            console.error(
                "Roadmap API error:",
                error
            );

            setError(
                "Unable to load roadmap."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleGenerateRoadmap = async () => {

    try {

        setGenerating(true);

        console.log("Generating roadmap with AI...");

        const response = await api.post(
            `/goals/${goalId}/1/generate-roadmap`
        );

        console.log(
            "AI Roadmap generated:",
            response.data
        );

        // Get the newly generated roadmap
        await fetchRoadmap();

    } catch (error) {

        console.error(
            "Roadmap generation failed:",
            error
        );

    } finally {

        setGenerating(false);

    }
};

const handleTaskToggle = async (task) => {

    // console.log("CLICKED TASK:", task);
    // console.log("TASK ID:", task.taskId);
    // console.log("TASK STATUS:", task.status);
    // console.log("Task EstimationHours: ", task.estimatedHours);

    try {

        setUpdatingTaskId(task.taskId);

        const newStatus =
            task.status === "COMPLETED"
                ? "PENDING"
                : "COMPLETED";

        await api.put(`/tasks/${task.taskId}`, {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: newStatus,
            estimatedHours: task.estimatedHours
        });

        // console.log(
        //     `Task ${task.taskId} updated to ${newStatus}`
        // );

        // Fetch fresh roadmap data.
        await fetchRoadmap();

    } catch (error) {

        console.error(
            "Task update failed:",
            error
        );

    } finally {

        setUpdatingTaskId(null);

    }
};


    if (loading) {

        return (
            <div className="roadmap-page">

                <Sidebar />

                <div className="roadmap-main">

                    <Navbar />

                    <main className="roadmap-content">

                        <div className="roadmap-loading">
                            Loading roadmap...
                        </div>

                    </main>

                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="roadmap-page">

                <Sidebar />

                <div className="roadmap-main">

                    <Navbar />

                    <main className="roadmap-content">

                        <div className="roadmap-error">
                            {error}
                        </div>

                    </main>

                </div>

            </div>
        );
    }


    return (
        <div className="roadmap-page">

            <Sidebar />

            <div className="roadmap-main">

                <Navbar />

                <main className="roadmap-content">

                    {/* =========================
                        GOAL HEADER
                    ========================= */}

                    <section className="roadmap-header">

                        <div>

                            <p className="roadmap-label">
                                YOUR ROADMAP
                            </p>

                            <h1>
                                {roadmap?.title}
                            </h1>

                            <p className="roadmap-subtitle">
                                Follow your milestones and
                                complete tasks to reach your goal.
                            </p>

                        </div>


                        <div className="overall-progress">

                            <span>
                                Overall Progress
                            </span>

                            <strong>
                                {Number(
                                    roadmap?.progress ?? 0
                                ).toFixed(0)}%
                            </strong>

                        </div>

                    </section>

                    {/* AI ROADMAP GENERATION */}

                        <div className="ai-roadmap-section">

                            <div className="ai-roadmap-info">

                                <span className="ai-roadmap-icon">
                                    ✨
                                </span>

                                <div>
                                    <h3>
                                        Roadmap generated by AI
                                    </h3>

                                    <p>
                                        Your roadmap is created based on your goal,
                                        current level and target date.
                                    </p>
                                </div>

                            </div>


                            <button
                                className={`generate-ai-btn ${
                                    roadmap?.milestones?.length > 0
                                        ? "roadmap-exists"
                                        : ""
                                }`}
                                onClick={handleGenerateRoadmap}
                                disabled={
                                    generating ||
                                    roadmap?.milestones?.length > 0
                                }
                            >

                                {generating
                                    ? "Generating..."
                                    : roadmap?.milestones?.length > 0
                                        ? "✓ Roadmap Generated"
                                        : "✨ Generate with AI"
                                }

                            </button>

                        </div>


                    {/* =========================
                        OVERALL PROGRESS BAR
                    ========================= */}

                    {/* <section className="roadmap-progress-card">

                        <div className="progress-header">

                            <span>
                                Goal Progress
                            </span>

                            <span>
                                {Number(
                                    roadmap?.progress ?? 0
                                ).toFixed(0)}%
                            </span>

                        </div>


                        <div className="progress-track">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${roadmap?.progress ?? 0}%`
                                }}
                            />

                        </div>

                    </section> */}


                    {/* =========================
                        MILESTONES
                    ========================= */}

                    <section className="milestones-section">

                        <div className="section-heading">

                            <h2>
                                Milestones
                            </h2>

                            <span>
                                {roadmap?.milestones?.length ?? 0}
                            </span>

                        </div>


                        {roadmap?.milestones?.map(
                            (milestone, index) => (

                                <div
                                    className="milestone-card"
                                    key={index}
                                >

                                    {/* Milestone Header */}

                                    <div className="milestone-header">

                                        <div className="milestone-number">
                                            {milestone.orderNumber}
                                        </div>


                                        <div className="milestone-info">

                                            <h3>
                                                {milestone.title}
                                            </h3>

                                            <p>
                                                {milestone.description}
                                            </p>

                                        </div>


                                        <div className="milestone-progress">

                                            <strong>
                                                {Number(
                                                    milestone.progress ?? 0
                                                ).toFixed(0)}%
                                            </strong>

                                        </div>

                                    </div>


                                    {/* Milestone Progress */}

                                    <div className="milestone-progress-bar">

                                        <div
                                            className="milestone-progress-fill"
                                            style={{
                                                width: `${milestone.progress ?? 0}%`
                                            }}
                                        />

                                    </div>


                                    {/* Tasks */}

                                    <div className="tasks-container">

                                        {milestone.tasks?.map((task) => {

                                            const completed =
                                                task.status === "COMPLETED";

                                            const updating =
                                                updatingTaskId === task.taskId;

                                            return (

                                                <div
                                                    className={`task-card ${
                                                        completed ? "task-completed" : ""
                                                    }`}
                                                    key={task.taskId}
                                                >

                                                    <button
                                                        className={`task-checkbox ${
                                                            completed ? "checked" : ""
                                                        }`}
                                                        onClick={() => handleTaskToggle(task)}
                                                        disabled={updating}
                                                        aria-label={
                                                            completed
                                                                ? "Mark task as pending"
                                                                : "Mark task as completed"
                                                        }
                                                    >

                                                        {completed && "✓"}

                                                    </button>


                                                    <div className="task-content">

                                                        <h4>
                                                            {task.title}
                                                        </h4>

                                                        <p>
                                                            {task.description}
                                                        </p>


                                                        <div className="task-meta">

                                                            <span>
                                                                {task.priority}
                                                            </span>

                                                            <span>
                                                                {task.estimatedHours} hours
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            );

                                        })}

                                    </div>

                                </div>

                            )
                        )}

                    </section>

                </main>

            </div>

        </div>
    );
}


export default Roadmap;