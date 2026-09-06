import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import api from "../../api/api.js";

import "./Goals.css";


function Goals() {

    const navigate = useNavigate();

    const [goals, setGoals] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =========================
       MODAL STATE
    ========================= */

    const [showGoalModal, setShowGoalModal] = useState(false);

    const [editingGoal, setEditingGoal] = useState(null);

    const [savingGoal, setSavingGoal] = useState(false);

    const [formError, setFormError] = useState("");

    /* =========================
       DELETE STATE
    ========================= */

    const [deletingGoal, setDeletingGoal] = useState(null);

    const [deleting, setDeleting] = useState(false);

    /* =========================
       FORM DATA
    ========================= */

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetDate: "",
        currentLevel: "BEGINNER"
    });


    /* =========================
       GET ALL GOALS
    ========================= */

    useEffect(() => {
        fetchGoals();
    }, []);


    const fetchGoals = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/goals");

            setGoals(response.data);

        } catch (error) {

            console.error("GET GOALS ERROR:", error);

            setError("Unable to load your goals.");

        } finally {

            setLoading(false);

        }
    };


    /* =========================
       FORM INPUT
    ========================= */

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    /* =========================
       RESET FORM
    ========================= */

    const resetForm = () => {

        setFormData({
            title: "",
            description: "",
            targetDate: "",
            currentLevel: "BEGINNER"
        });

        setFormError("");
    };


    /* =========================
       OPEN CREATE MODAL
    ========================= */

    const openCreateModal = () => {

        setEditingGoal(null);

        resetForm();

        setShowGoalModal(true);
    };


    /* =========================
       OPEN EDIT MODAL
    ========================= */

    const openEditModal = (goal) => {

        setEditingGoal(goal);

        setFormError("");

        setFormData({
            title: goal.title || "",
            description: goal.description || "",
            targetDate: goal.targetDate
                ? goal.targetDate.substring(0, 10)
                : "",
            currentLevel:
                goal.currentLevel ||
                goal.level ||
                "BEGINNER"
        });

        setShowGoalModal(true);
    };


    /* =========================
       CLOSE GOAL MODAL
    ========================= */

    const closeGoalModal = () => {

        if (savingGoal) {
            return;
        }

        setShowGoalModal(false);

        setEditingGoal(null);

        resetForm();
    };


    /* =========================
   CREATE / UPDATE GOAL
========================= */

const handleGoalSubmit = async (event) => {

    event.preventDefault();

    setFormError("");

    if (!formData.title.trim()) {

        setFormError("Goal title is required.");

        return;
    }

    if (!formData.description.trim()) {

        setFormError("Goal description is required.");

        return;
    }

    if (!formData.targetDate) {

        setFormError("Target date is required.");

        return;
    }


    try {

        setSavingGoal(true);


        /* =========================
           UPDATE
        ========================= */

        if (editingGoal) {

            await api.put(
                `/goals/${editingGoal.id}`,
                formData
            );

            /*
             * Do NOT use response.data here.
             *
             * The PUT response may not contain the
             * complete Goal object.
             *
             * Fetch the complete goals list again
             * from the backend.
             */

            await fetchGoals();

        }


        /* =========================
           CREATE
        ========================= */

        else {

            await api.post(
                "/goals",
                formData
            );

            /*
             * Reload complete goals list.
             * This keeps CREATE and UPDATE behavior
             * consistent.
             */

            await fetchGoals();
        }


        /* =========================
           CLOSE MODAL
        ========================= */

        setShowGoalModal(false);

        setEditingGoal(null);

        resetForm();


    } catch (error) {

        console.error(
            editingGoal
                ? "UPDATE GOAL ERROR:"
                : "CREATE GOAL ERROR:",
            error
        );

        console.error(
            "BACKEND RESPONSE:",
            error.response?.data
        );

        setFormError(
            error.response?.data?.message ||
            (
                editingGoal
                    ? "Unable to update goal."
                    : "Unable to create goal."
            )
        );


    } finally {

        setSavingGoal(false);
    }
};


    /* =========================
       OPEN DELETE CONFIRMATION
    ========================= */

    const openDeleteConfirmation = (goal) => {

        setDeletingGoal(goal);
    };


    /* =========================
       CLOSE DELETE CONFIRMATION
    ========================= */

    const closeDeleteConfirmation = () => {

        if (deleting) {
            return;
        }

        setDeletingGoal(null);
    };


    /* =========================
       DELETE GOAL
    ========================= */

    const handleDeleteGoal = async () => {

        if (!deletingGoal) {
            return;
        }

        try {

            setDeleting(true);

            await api.delete(
                `/goals/${deletingGoal.id}`
            );


            setGoals((previousGoals) =>
                previousGoals.filter(
                    (goal) =>
                        goal.id !== deletingGoal.id
                )
            );


            setDeletingGoal(null);

        } catch (error) {

            console.error(
                "DELETE GOAL ERROR:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to delete goal."
            );

        } finally {

            setDeleting(false);
        }
    };


    /* =========================
       OPEN ROADMAP
    ========================= */

    const openRoadmap = (goalId) => {

        navigate(`/roadmap/${goalId}`);
    };


    /* =========================
       CHECK ROADMAP
    ========================= */

    // const hasRoadmap = (goal) => {

    //     return Boolean(
    //         goal.hasRoadmap ||
    //         goal.roadmapId ||
    //         goal.roadmap ||
    //         goal.milestones?.length
    //     );
    // };


    /* =========================
       PROGRESS
    ========================= */

    const getProgress = (goal) => {

        return Number(goal.progress ?? 0);
    };


    return (

        <div className="goals-page">

            <Sidebar />

            <div className="goals-main">

                <Navbar />

                <main className="goals-content">


                    {/* =========================
                        HEADER
                    ========================= */}

                    <section className="goals-header">

                        <div>

                            <p className="goals-label">
                            </p>

                            <h1>
                                My Goals
                            </h1>

                            <p className="goals-subtitle">
                                Manage your goals and track your progress.
                            </p>

                        </div>


                        <button
                            className="create-goal-btn"
                            onClick={openCreateModal}
                        >
                            + Create Goal
                        </button>

                    </section>


                    {/* =========================
                        LOADING
                    ========================= */}

                    {loading && (

                        <div className="goals-message">
                            Loading your goals...
                        </div>

                    )}


                    {/* =========================
                        ERROR
                    ========================= */}

                    {!loading && error && (

                        <div className="goals-error">
                            {error}
                        </div>

                    )}


                    {/* =========================
                        EMPTY STATE
                    ========================= */}

                    {!loading &&
                        !error &&
                        goals.length === 0 && (

                            <section className="empty-goals">

                                <div className="empty-goals-icon">
                                    ◎
                                </div>

                                <h2>
                                    No goals yet
                                </h2>

                                <p>
                                    Create your first goal and
                                    start building your roadmap.
                                </p>

                                <button
                                    className="create-goal-empty-btn"
                                    onClick={openCreateModal}
                                >
                                    Create Your First Goal
                                </button>

                            </section>
                        )}


                    {/* =========================
                        GOAL CARDS
                    ========================= */}

                    {!loading &&
                        !error &&
                        goals.length > 0 && (

                            <section className="goals-grid">

                                {goals.map((goal) => {

                                    const progress =
                                        getProgress(goal);

                                    return (

                                        <article
                                            className="goal-card"
                                            key={goal.id}
                                        >


                                            {/* =========================
                                                CARD HEADER
                                            ========================= */}

                                            <div className="goal-card-header">

                                                <div className="goal-icon">
                                                    ◎
                                                </div>


                                                <div className="goal-card-actions">


                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        className="goal-action-btn goal-edit-btn"
                                                        onClick={() =>
                                                            openEditModal(goal)
                                                        }
                                                        title="Edit goal"
                                                        aria-label={`Edit ${goal.title}`}
                                                    >
                                                        ✎
                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="goal-action-btn goal-delete-btn"
                                                        onClick={() =>
                                                            openDeleteConfirmation(goal)
                                                        }
                                                        title="Delete goal"
                                                        aria-label={`Delete ${goal.title}`}
                                                    >
                                                        🗑
                                                    </button>


                                                    {/* STATUS */}

                                                    <span
                                                        className={`goal-status status-${goal.status?.toLowerCase()}`}
                                                    >
                                                        {goal.status}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* =========================
                                                GOAL INFORMATION
                                            ========================= */}

                                            <div className="goal-info">

                                                <h2>
                                                    {goal.title}
                                                </h2>

                                                <p>
                                                    {goal.description}
                                                </p>

                                            </div>


                                            {/* =========================
                                                DETAILS
                                            ========================= */}

                                            <div className="goal-details">

                                                <div className="goal-detail">

                                                    <span>
                                                        Level
                                                    </span>

                                                    <strong>
                                                        {
                                                            goal.currentLevel ||
                                                            goal.level ||
                                                            "N/A"
                                                        }
                                                    </strong>

                                                </div>


                                                <div className="goal-detail">

                                                    <span>
                                                        Target Date
                                                    </span>

                                                    <strong>

                                                        {
                                                            goal.targetDate
                                                                ? new Date(
                                                                    goal.targetDate
                                                                ).toLocaleDateString(
                                                                    "en-GB",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "2-digit",
                                                                        year: "numeric"
                                                                    }
                                                                )
                                                                : "Not set"
                                                        }

                                                    </strong>

                                                </div>

                                            </div>


                                            {/* =========================
                                                PROGRESS
                                            ========================= */}

                                            <div className="goal-progress-section">

                                                <div className="goal-progress-header">

                                                    <span>
                                                        Progress
                                                    </span>

                                                    <strong>
                                                        {progress.toFixed(0)}%
                                                    </strong>

                                                </div>


                                                <div className="goal-progress-track">

                                                    <div
                                                        className="goal-progress-fill"
                                                        style={{
                                                            width: `${Math.min(
                                                                progress,
                                                                100
                                                            )}%`
                                                        }}
                                                    />

                                                </div>

                                            </div>


                                            {/* =========================
                                                ROADMAP
                                            ========================= */}

                                                <button
                                                    className="view-roadmap-btn"
                                                    onClick={() =>
                                                        openRoadmap(goal.id)
                                                    }
                                                >
                                                    View Roadmap

                                                    <span>
                                                        →
                                                    </span>

                                                </button>

                                        

                                        </article>
                                    );
                                })}

                            </section>
                        )}

                </main>

            </div>


            {/* =================================================
                CREATE / EDIT GOAL MODAL
            ================================================= */}

            {showGoalModal && (

                <div
                    className="goal-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeGoalModal();
                        }

                    }}
                >

                    <div className="goal-modal">


                        {/* MODAL HEADER */}

                        <div className="goal-modal-header">

                            <div>

                                <h2>
                                    {editingGoal
                                        ? "Edit Goal"
                                        : "Create New Goal"
                                    }
                                </h2>

                                <p>
                                    {editingGoal
                                        ? "Update your goal details."
                                        : "Define what you want to achieve."
                                    }
                                </p>

                            </div>


                            <button
                                className="modal-close-btn"
                                onClick={closeGoalModal}
                                disabled={savingGoal}
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            className="goal-form"
                            onSubmit={handleGoalSubmit}
                        >


                            {/* TITLE */}

                            <div className="form-group">

                                <label htmlFor="title">
                                    Goal Title
                                </label>

                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Java Full Stack with AI"
                                    value={formData.title}
                                    onChange={handleChange}
                                    disabled={savingGoal}
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group">

                                <label htmlFor="description">
                                    Description
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe what you want to achieve..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={savingGoal}
                                    rows="4"
                                />

                            </div>


                            {/* TARGET DATE */}

                            <div className="form-group">

                                <label htmlFor="targetDate">
                                    Target Date
                                </label>

                                <input
                                    id="targetDate"
                                    name="targetDate"
                                    type="date"
                                    value={formData.targetDate}
                                    onChange={handleChange}
                                    disabled={savingGoal}
                                />

                            </div>


                            {/* CURRENT LEVEL */}

                            <div className="form-group">

                                <label htmlFor="currentLevel">
                                    Current Level
                                </label>

                                <select
                                    id="currentLevel"
                                    name="currentLevel"
                                    value={formData.currentLevel}
                                    onChange={handleChange}
                                    disabled={savingGoal}
                                >

                                    <option value="BEGINNER">
                                        Beginner
                                    </option>

                                    <option value="INTERMEDIATE">
                                        Intermediate
                                    </option>

                                    <option value="ADVANCED">
                                        Advanced
                                    </option>

                                </select>

                            </div>


                            {/* ERROR */}

                            {formError && (

                                <div className="form-error">
                                    {formError}
                                </div>

                            )}


                            {/* ACTIONS */}

                            <div className="goal-form-actions">

                                <button
                                    type="button"
                                    className="cancel-goal-btn"
                                    onClick={closeGoalModal}
                                    disabled={savingGoal}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="submit-goal-btn"
                                    disabled={savingGoal}
                                >

                                    {savingGoal
                                        ? editingGoal
                                            ? "Updating..."
                                            : "Creating..."
                                        : editingGoal
                                            ? "Update Goal"
                                            : "Create Goal"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {/* =================================================
                DELETE CONFIRMATION MODAL
            ================================================= */}

            {deletingGoal && (

                <div
                    className="delete-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeDeleteConfirmation();
                        }

                    }}
                >

                    <div className="delete-modal">


                        <div className="delete-modal-icon">
                            🗑
                        </div>


                        <div className="delete-modal-content">

                            <h2>
                                Delete Goal?
                            </h2>

                            <p>
                                Are you sure you want to delete
                                <strong>
                                    {" "}
                                    "{deletingGoal.title}"
                                </strong>
                                ?
                            </p>

                            <span>
                                This action cannot be undone.
                            </span>

                        </div>


                        <div className="delete-modal-actions">

                            <button
                                type="button"
                                className="delete-cancel-btn"
                                onClick={closeDeleteConfirmation}
                                disabled={deleting}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="delete-confirm-btn"
                                onClick={handleDeleteGoal}
                                disabled={deleting}
                            >

                                {deleting
                                    ? "Deleting..."
                                    : "Delete Goal"
                                }

                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}


export default Goals;