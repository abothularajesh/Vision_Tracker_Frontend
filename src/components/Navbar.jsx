
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const [profileOpen, setProfileOpen] = useState(false);

    /*
     * DARK MODE
     */
    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }

    }, [darkMode]);


    /*
     * TOGGLE THEME
     */
    const toggleTheme = () => {
        setDarkMode((previous) => !previous);
    };


    /*
     * MOBILE SIDEBAR
     *
     * Sidebar listens for this event and opens/closes itself.
     * This allows Navbar and Sidebar to communicate without
     * changing the existing Dashboard layout.
     */
    const toggleMobileSidebar = () => {
        window.dispatchEvent(new Event("toggleSidebar"));
    };


    /*
     * LOGOUT
     */
    const handleLogout = () => {

        /*
         * Clear assistant chat memory.
         */
        window.dispatchEvent(new Event("userLogout"));

        /*
         * Remove authentication data.
         */
        localStorage.removeItem("token");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        /*
         * Go to login page.
         */
        navigate("/login");
    };


    return (
        <header className="navbar">

            <div className="navbar-left">

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleMobileSidebar}
                    aria-label="Open navigation menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <h2>Dashboard</h2>

            </div>


            <div className="navbar-right">

                {/* Theme Toggle */}

                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >

                    {darkMode ? (

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >

                            <circle
                                cx="12"
                                cy="12"
                                r="5"
                            />

                            <line
                                x1="12"
                                y1="1"
                                x2="12"
                                y2="3"
                            />

                            <line
                                x1="12"
                                y1="21"
                                x2="12"
                                y2="23"
                            />

                            <line
                                x1="4.22"
                                y1="4.22"
                                x2="5.64"
                                y2="5.64"
                            />

                            <line
                                x1="18.36"
                                y1="18.36"
                                x2="19.78"
                                y2="19.78"
                            />

                            <line
                                x1="1"
                                y1="12"
                                x2="3"
                                y2="12"
                            />

                            <line
                                x1="21"
                                y1="12"
                                x2="23"
                                y2="12"
                            />

                            <line
                                x1="4.22"
                                y1="19.78"
                                x2="5.64"
                                y2="18.36"
                            />

                            <line
                                x1="18.36"
                                y1="5.64"
                                x2="19.78"
                                y2="4.22"
                            />

                        </svg>

                    ) : (

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#000000"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>

                    )}

                </button>


                {/* User Profile */}

                <div className="profile-container">

                    <button
                        className="user-profile"
                        onClick={() =>
                            setProfileOpen((previous) => !previous)
                        }
                    >

                        <div className="user-avatar">

                            {username
                                ? username.charAt(0).toUpperCase()
                                : "U"
                            }

                        </div>


                        <div className="user-info">

                            <span className="user-name">
                                {username || "User"}
                            </span>

                            <span className="user-role">
                            </span>

                        </div>


                        <span className="profile-arrow">

                            {profileOpen
                                ? "▲"
                                : "▼"
                            }

                        </span>

                    </button>


                    {/* Profile Dropdown */}

                    {profileOpen && (

                        <div className="profile-dropdown">

                            {/* Profile Header */}

                            <div className="profile-header">

                                <div className="dropdown-avatar">

                                    {username
                                        ? username.charAt(0).toUpperCase()
                                        : "U"
                                    }

                                </div>


                                <div className="dropdown-user-info">

                                    <span className="dropdown-name">
                                        {username || "User"}
                                    </span>

                                    <span className="dropdown-email">
                                        {email || "No email available"}
                                    </span>

                                </div>

                            </div>


                            <div className="dropdown-divider"></div>


                            {/* Navigation */}

                            <button
                                className="dropdown-item"
                                onClick={() => navigate("/goals")}
                            >
                                <span>🎯</span>
                                <span>My Goals</span>
                            </button>


                            <button
                                className="dropdown-item"
                                onClick={() => navigate("/progress")}
                            >
                                <span>📊</span>
                                <span>Progress</span>
                            </button>


                            <button
                                className="dropdown-item"
                                onClick={() => navigate("/notebook")}
                            >
                                <span>📓</span>
                                <span>Notebook</span>
                            </button>


                            <div className="dropdown-divider"></div>


                            {/* Settings */}

                            <button
                                className="dropdown-item"
                                onClick={() => navigate("/settings")}
                            >
                                <span>⚙️</span>
                                <span>Settings</span>
                            </button>


                            <div className="dropdown-divider"></div>


                            {/* Logout */}

                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >

                                <svg
                                    className="logout-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >

                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

                                    <polyline points="16 17 21 12 16 7" />

                                    <line
                                        x1="21"
                                        y1="12"
                                        x2="9"
                                        y2="12"
                                    />

                                </svg>

                                Logout

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
}

export default Navbar;
