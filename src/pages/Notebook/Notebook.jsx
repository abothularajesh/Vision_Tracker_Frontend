import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import "./Notebook.css";

function Notebook() {

    const [notes, setNotes] = useState([]);

    const [selectedNote, setSelectedNote] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");

    const [isCreating, setIsCreating] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(false);


    /*
     * JWT
     *
     * Change "token" here only if your localStorage
     * uses a different key for the JWT.
     */
    const getToken = () => {

        return localStorage.getItem("jwtToken");
    };


    /*
     * GET ALL NOTES
     */
    const loadNotes = async () => {

        try {

            setLoading(true);

            const token = getToken();

            const response = await fetch(
                "http://localhost:8080/api/notes",
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load notes");
            }

            const data = await response.json();

            setNotes(data);

            /*
             * If notes exist, select the first one.
             */
            if (data.length > 0) {

                setSelectedNote(data[0]);

                setTitle(data[0].title || "");
                setContent(data[0].content || "");

            } else {

                setSelectedNote(null);

                setTitle("");
                setContent("");
            }

        } catch (error) {

            console.error("Error loading notes:", error);

        } finally {

            setLoading(false);
        }
    };


    /*
     * LOAD NOTES WHEN PAGE OPENS
     */
    useEffect(() => {

        loadNotes();

    }, []);


    /*
     * SEARCH
     *
     * Backend:
     * GET /api/notes/search?keyword=java
     */
    const handleSearch = async (keyword) => {

        setSearchQuery(keyword);

        /*
         * If search box is empty,
         * load all notes again.
         */
        if (!keyword.trim()) {

            loadNotes();

            return;
        }

        try {

            const token = getToken();

            const response = await fetch(
                `http://localhost:8080/api/notes/search?keyword=${encodeURIComponent(keyword)}`,
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();

            setNotes(data);

        } catch (error) {

            console.error("Error searching notes:", error);
        }
    };


    /*
     * SELECT NOTE
     */
    const handleSelectNote = (note) => {

        setSelectedNote(note);

        setIsCreating(false);

        setTitle(note.title || "");
        setContent(note.content || "");
    };


    /*
     * NEW NOTE
     */
    const handleNewNote = () => {

        setIsCreating(true);

        setSelectedNote(null);

        setTitle("");
        setContent("");
    };


    /*
     * SAVE NOTE
     *
     * Creating:
     * POST /api/notes
     *
     * Updating:
     * PUT /api/notes/{id}
     */
    const handleSave = async () => {

        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }

        try {

            const token = getToken();

        /*
        * CREATE
        */
        if (isCreating) {

            const response = await fetch(
                "http://localhost:8080/api/notes",
                {
                    method: "POST",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        title: title,
                        content: content
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create note");
            }

            /*
            * Backend now returns NotesDTO as JSON.
            */
            const newNote = await response.json();

            /*
            * Add the newly created note
            * without removing existing notes.
            */
            setNotes((previousNotes) => [
                newNote,
                ...previousNotes
            ]);

            /*
            * Select the newly created note.
            */
            setSelectedNote(newNote);

            /*
            * Exit create mode.
            */
            setIsCreating(false);

            /*
            * Show the saved note in the editor.
            */
            setTitle(newNote.title || "");
            setContent(newNote.content || "");

            return;
        }


            /*
             * UPDATE
             */
            if (selectedNote) {

                const response = await fetch(
                    `http://localhost:8080/api/notes/${selectedNote.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            title: title,
                            content: content
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to update note");
                }

                /*
                 * Backend returns:
                 *
                 * "Updated Successfully"
                 *
                 * So update the frontend manually.
                 */
                const updatedNote = {
                    ...selectedNote,
                    title: title,
                    content: content
                };

                setNotes((previousNotes) =>
                    previousNotes.map((note) =>
                        note.id === selectedNote.id
                            ? updatedNote
                            : note
                    )
                );

                setSelectedNote(updatedNote);
            }

        } catch (error) {

            console.error("Error saving note:", error);
        }
    };


    /*
     * DELETE NOTE
     *
     * DELETE /api/notes/{id}
     */
    const handleDelete = async () => {

        if (!selectedNote) {
            return;
        }

        try {

            const token = getToken();

            const response = await fetch(
                `http://localhost:8080/api/notes/${selectedNote.id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete note");
            }

            /*
             * Remove deleted note from frontend.
             */
            const remainingNotes = notes.filter(
                (note) => note.id !== selectedNote.id
            );

            setNotes(remainingNotes);

            /*
             * Select next available note.
             */
            if (remainingNotes.length > 0) {

                const nextNote = remainingNotes[0];

                setSelectedNote(nextNote);

                setTitle(nextNote.title || "");
                setContent(nextNote.content || "");

            } else {

                setSelectedNote(null);

                setTitle("");
                setContent("");
            }

        } catch (error) {

            console.error("Error deleting note:", error);
        }
    };


    return (
        <div className="notebook-page">

            <Sidebar />

            <div className="notebook-main">

                <Navbar />

                <main className="notebook-content">

                    {/* Header */}

                    <div className="notebook-header">

                        <div>

                            <h1>Notebook</h1>

                            <p>
                                Capture your ideas, notes and important information.
                            </p>

                        </div>

                        <button
                            className="new-note-btn"
                            onClick={handleNewNote}
                        >
                            <span>+</span>
                            New Note
                        </button>

                    </div>


                    {/* Workspace */}

                    <div className="notebook-workspace">


                        {/* Notes Panel */}

                        <section className="notes-panel">

                            <div className="notes-panel-header">

                                <h3>Notes</h3>

                                <span>
                                    {notes.length}
                                </span>

                            </div>


                            {/* Search */}

                            <div className="notes-search">

                                <span className="search-icon">
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(event) =>
                                        handleSearch(event.target.value)
                                    }
                                />

                            </div>


                            {/* Notes List */}

                            <div className="notes-list">

                                {loading ? (

                                    <div className="no-notes">
                                        <p>Loading notes...</p>
                                    </div>

                                ) : notes.length > 0 ? (

                                    notes.map((note) => (

                                        <button
                                            key={note.id}
                                            className={`note-item ${
                                                selectedNote?.id === note.id
                                                    ? "active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleSelectNote(note)
                                            }
                                        >

                                            <div className="note-item-title">
                                                {note.title}
                                            </div>

                                            <div className="note-item-preview">
                                                {note.content}
                                            </div>

                                            <div className="note-item-date">
                                                {note.updatedAt || "Recently"}
                                            </div>

                                        </button>

                                    ))

                                ) : (

                                    <div className="no-notes">

                                        <span>📝</span>

                                        <p>
                                            {searchQuery
                                                ? "No notes found"
                                                : "No notes yet"}
                                        </p>

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* Editor */}

                        <section className="note-editor">

                            {selectedNote || isCreating ? (

                                <>

                                    {/* Editor Header */}

                                    <div className="editor-header">

                                        <span>
                                            {isCreating
                                                ? "New Note"
                                                : "Editing Note"
                                            }
                                        </span>

                                        {!isCreating && (

                                            <button
                                                className="delete-note-btn"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>

                                        )}

                                    </div>


                                    {/* Editor Body */}

                                    <div className="editor-body">

                                        <input
                                            className="note-title-input"
                                            type="text"
                                            placeholder="Enter title"
                                            value={title}
                                            onChange={(event) =>
                                                setTitle(event.target.value)
                                            }
                                        />

                                        <textarea
                                            className="note-content-input"
                                            placeholder="Start writing your notes..."
                                            value={content}
                                            onChange={(event) =>
                                                setContent(event.target.value)
                                            }
                                        />

                                    </div>


                                    {/* Editor Footer */}

                                    <div className="editor-footer">

                                        <span className="editor-hint">

                                            {isCreating
                                                ? "Create a new note"
                                                : "Changes are not saved yet"
                                            }

                                        </span>

                                        <button
                                            className="save-note-btn"
                                            onClick={handleSave}
                                        >
                                            Save Note
                                        </button>

                                    </div>

                                </>

                            ) : (

                                <div className="empty-editor">

                                    <div className="empty-editor-icon">
                                        📝
                                    </div>

                                    <h3>Select a note</h3>

                                    <p>
                                        Select a note from the list or create
                                        a new one.
                                    </p>

                                    <button
                                        className="empty-new-note-btn"
                                        onClick={handleNewNote}
                                    >
                                        + Create New Note
                                    </button>

                                </div>

                            )}

                        </section>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Notebook;
