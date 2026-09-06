
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

    const [mobileOpen, setMobileOpen] = useState(false);


    /*
     * Listen for the menu button event
     * sent from Navbar.
     */
    useEffect(() => {

        const toggleSidebar = () => {
            setMobileOpen((previous) => !previous);
        };

        window.addEventListener("toggleSidebar", toggleSidebar);

        return () => {
            window.removeEventListener(
                "toggleSidebar",
                toggleSidebar
            );
        };

    }, []);


    /*
     * Close sidebar on mobile
     */
    const closeSidebar = () => {
        setMobileOpen(false);
    };


    /*
     * Close sidebar when a navigation item is selected.
     */
    const handleNavigation = () => {
        setMobileOpen(false);
    };


    return (
        <>

            {/* Mobile Overlay */}

            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={closeSidebar}
                ></div>
            )}


            <aside
                className={`sidebar ${
                    mobileOpen ? "mobile-open" : ""
                }`}
            >

                {/* Logo */}

                <div className="sidebar-logo">

                    <div className="logo-icon">
                        VT
                    </div>

                    <span>
                        Vision Tracker
                    </span>

                </div>


                {/* Navigation */}

                <nav className="sidebar-nav">

                    <NavLink
                        to="/dashboard"
                        className="sidebar-link"
                        onClick={handleNavigation}
                    >
                        <span>⌂</span>
                        Dashboard
                    </NavLink>


                    <NavLink
                        to="/goals"
                        className="sidebar-link"
                        onClick={handleNavigation}
                    >
                        <span>◎</span>
                        Goals
                    </NavLink>


                    <NavLink
                        to="/tasks"
                        className="sidebar-link"
                        onClick={handleNavigation}
                    >
                        <span>✓</span>
                        To-DO-List
                    </NavLink>


                    <NavLink
                        to="/progress"
                        className="sidebar-link"
                        onClick={handleNavigation}
                    >
                        <span>◈</span>
                        Progress
                    </NavLink>


                    <NavLink
                        to="/notebook"
                        className="sidebar-link"
                        onClick={handleNavigation}
                    >
                        <span>📓</span>
                        Notes
                    </NavLink>

                </nav>


                {/* Bottom */}

                <div className="sidebar-bottom">

                    <NavLink
                        to="/settings"
                        className="sidebar-link"
                        onClick={handleNavigation}
                    >
                        <span>⚙</span>
                        Settings
                    </NavLink>

                </div>

            </aside>

        </>
    );
}

export default Sidebar;

