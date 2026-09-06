import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import api from "../../api/api.js";

import "./Progress.css";


function Progress() {

    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchProgress = async () => {

            try {

                const response = await api.get("/progress");

                //console.log("PROGRESS RESPONSE:", response.data);
                //console.log("Over all Progress", response.data.overAllProgress);

                setProgressData(response.data);

            } catch (error) {

                console.error("Progress API error:", error);

                setError("Unable to load progress data.");

            } finally {

                setLoading(false);

            }
        };

        fetchProgress();

    }, []);


    if (loading) {

        return (
            <div className="progress-page">

                <Sidebar />

                <div className="progress-main">

                    <Navbar />

                    <main className="progress-content">

                        <p>Loading progress...</p>

                    </main>

                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="progress-page">

                <Sidebar />

                <div className="progress-main">

                    <Navbar />

                    <main className="progress-content">

                        <p className="progress-error">
                            {error}
                        </p>

                    </main>

                </div>

            </div>
        );
    }


    return (
        <div className="progress-page">

            <Sidebar />

            <div className="progress-main">

                <Navbar />

                <main className="progress-content">

                    {/* =========================
                        HEADER
                    ========================= */}

                    <section className="progress-header">

                        <h1>Your Progress</h1>

                        <p>
                            Track your goals, milestones and task completion.
                        </p>

                    </section>


                    {/* =========================
                        OVERALL PROGRESS
                    ========================= */}

                    <section className="overall-progress-card">

                        <div className="overall-progress-info">

                            <span className="progress-label">
                                Overall Progress
                            </span>

                            <strong className="overall-progress-value">
                                {(progressData?.overAllProgress ?? 0).toFixed(0)}%
                            </strong>

                            <p>
                                Keep completing tasks to move closer to your goals.
                            </p>

                        </div>


                        <div
                            className="progress-circle"
                            style={{
                                "--progress": `${(progressData?.overAllProgress ?? 0) * 3.6}deg`
                            }}
                        >

                            <div className="progress-circle-inner">

                                <strong>
                                    {(progressData?.overAllProgress ?? 0).toFixed(0)}%
                                </strong>

                                <span>
                                    Complete
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =========================
                        STATISTICS
                    ========================= */}

                    <section className="progress-stats">

                        <div className="progress-stat-card">

                            <span>
                                Total Goals
                            </span>

                            <strong>
                                {progressData?.totalGoals ?? 0}
                            </strong>

                        </div>


                        <div className="progress-stat-card">

                            <span>
                                Total Tasks
                            </span>

                            <strong>
                                {progressData?.totalTasks ?? 0}
                            </strong>

                        </div>


                        <div className="progress-stat-card">

                            <span>
                                Completed
                            </span>

                            <strong>
                                {progressData?.completedTasks ?? 0}
                            </strong>

                        </div>


                        <div className="progress-stat-card">

                            <span>
                                Pending
                            </span>

                            <strong>
                                {progressData?.pendingTasks ?? 0}
                            </strong>

                        </div>

                    </section>


                    {/* =========================
                        GOALS
                    ========================= */}

                    <section className="goals-progress-section">

                        <div className="section-heading">

                            <h2>
                                Goal Progress
                            </h2>

                            <span>
                                {progressData?.totalGoals ?? 0} {progressData?.totalGoals === 1 ? 'goal' : 'goals'}
                            </span>

                        </div>


                        <div className="goal-progress-list">

                            {progressData?.goals?.length > 0 ? (

                                progressData.goals.map((goal) => (

                                    <div
                                        className="goal-progress-card"
                                        key={goal.goalId}
                                    >

                                        <div className="goal-progress-header">

                                            <div>

                                                <h3>
                                                    {goal.title}
                                                </h3>

                                                <p>
                                                    {goal.completedTasks} of{" "}
                                                    {goal.totalTasks} tasks completed
                                                </p>

                                            </div>


                                            <strong>
                                                {(goal.progress ?? 0).toFixed(0)}%
                                            </strong>

                                        </div>


                                        <div className="progress-bar">

                                            <div
                                                className="progress-bar-fill"
                                                style={{
                                                    width: `${Math.min(
                                                        goal.progress ?? 0,
                                                        100
                                                    )}%`
                                                }}
                                            />

                                        </div>


                                        {/* =========================
                                            MILESTONES
                                        ========================= */}

                                        {goal.milestones?.length > 0 && (

                                            <div className="milestones-section">

                                                <h4>
                                                    Milestones
                                                </h4>


                                                <div className="milestone-list">

                                                    {goal.milestones.map(
                                                        (milestone) => (

                                                            <div
                                                                className="milestone-item"
                                                                key={
                                                                    milestone.milestoneId
                                                                }
                                                            >

                                                                <div className="milestone-header">

                                                                    <span>
                                                                        {
                                                                            milestone.title
                                                                        }
                                                                    </span>

                                                                    <span>
                                                                        {(
                                                                            milestone.progress ??
                                                                            0
                                                                        ).toFixed(0)}
                                                                        %
                                                                    </span>

                                                                </div>


                                                                <div className="milestone-progress-bar">

                                                                    <div
                                                                        className="milestone-progress-fill"
                                                                        style={{
                                                                            width: `${Math.min(
                                                                                milestone.progress ??
                                                                                    0,
                                                                                100
                                                                            )}%`
                                                                        }}
                                                                    />

                                                                </div>


                                                                <span className="milestone-task-count">

                                                                    {
                                                                        milestone.completedTasks
                                                                    }{" "}
                                                                    /{" "}
                                                                    {
                                                                        milestone.totalTasks
                                                                    }{" "}
                                                                    tasks completed

                                                                </span>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                ))

                            ) : (

                                <div className="empty-progress">

                                    <h3>
                                        No goals yet
                                    </h3>

                                    <p>
                                        Create a goal to start tracking your progress.
                                    </p>

                                </div>

                            )}

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}


export default Progress;