import { useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import Navbar from "../../components/Navbar.jsx";
import "./Settings.css";

function Settings() {

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    const handleThemeChange = (theme) => {

        const isDark = theme === "dark";

        setDarkMode(isDark);

        if (isDark) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <div className="settings-page">

            <Sidebar />

            <div className="settings-main">

                <Navbar />

                <main className="settings-content">

                    {/* Header */}

                    <div className="settings-header">

                        <div>
                            <h1>Settings</h1>

                            <p>
                                Manage your account and application preferences.
                            </p>
                        </div>

                    </div>


                    {/* Profile */}

                    <section className="settings-section">

                        <div className="settings-section-header">

                            <div className="settings-section-icon">
                                👤
                            </div>

                            <div>
                                <h2>Profile</h2>

                                <p>
                                    Your account information
                                </p>
                            </div>

                        </div>


                        <div className="settings-fields">

                            <div className="settings-field">

                                <label>Name</label>

                                <div className="settings-value">
                                    {username || "User"}
                                </div>

                            </div>


                            <div className="settings-field">

                                <label>Email</label>

                                <div className="settings-value">
                                    {email || "Email not available"}
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* Appearance */}

                    <section className="settings-section">

                        <div className="settings-section-header">

                            <div className="settings-section-icon">
                                🎨
                            </div>

                            <div>
                                <h2>Appearance</h2>

                                <p>
                                    Customize how Vision Tracker looks
                                </p>
                            </div>

                        </div>


                        <div className="theme-options">

                            <button
                                className={`theme-option ${
                                    !darkMode ? "active" : ""
                                }`}
                                onClick={() =>
                                    handleThemeChange("light")
                                }
                            >

                                <span className="theme-option-icon">
                                    ☀️
                                </span>

                                <div>
                                    <strong>Light</strong>

                                    <small>
                                        Use light appearance
                                    </small>
                                </div>

                                <span className="theme-check">
                                    {!darkMode ? "✓" : ""}
                                </span>

                            </button>


                            <button
                                className={`theme-option ${
                                    darkMode ? "active" : ""
                                }`}
                                onClick={() =>
                                    handleThemeChange("dark")
                                }
                            >

                                <span className="theme-option-icon">
                                    🌙
                                </span>

                                <div>
                                    <strong>Dark</strong>

                                    <small>
                                        Use dark appearance
                                    </small>
                                </div>

                                <span className="theme-check">
                                    {darkMode ? "✓" : ""}
                                </span>

                            </button>

                        </div>

                    </section>


                    {/* Account */}

                    <section className="settings-section">

                        <div className="settings-section-header">

                            <div className="settings-section-icon">
                                ⚙️
                            </div>

                            <div>
                                <h2>Account</h2>

                                <p>
                                    Manage your account
                                </p>
                            </div>

                        </div>


                        <div className="account-option">

                            <div>

                                <strong>Logout</strong>

                                <p>
                                    Sign out of your Vision Tracker account.
                                </p>

                            </div>

                            <button className="settings-logout-btn">
                                Logout
                            </button>

                        </div>

                    </section>


                    {/* Danger Zone */}

                    <section className="settings-section danger-section">

                        <div className="settings-section-header">

                            <div className="settings-section-icon danger-icon">
                                ⚠️
                            </div>

                            <div>
                                <h2>Danger Zone</h2>

                                <p>
                                    Irreversible account actions
                                </p>
                            </div>

                        </div>


                        <div className="account-option">

                            <div>

                                <strong>Delete Account</strong>

                                <p>
                                    Permanently delete your account and
                                    associated data.
                                </p>

                            </div>

                            <button
                                className="delete-account-btn"
                                disabled
                            >
                                Coming Soon
                            </button>

                        </div>

                    </section>

                </main>

            </div>

        </div>
    );
}

export default Settings;