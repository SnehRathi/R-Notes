import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './navigation.css';
import Sidebar from "./Sidebar";
import logo from "./images/logo.png";

function Navigation({ user, isLoggedIn, logoutHandler, totalNotesCount, currentTag, setCurrentTag, isSidebarOpen, setIsSidebarOpen }) {
    const [buttonClass, setButtonClass] = useState("side-button");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    function handleisSidebarOpen() {
        setIsSidebarOpen(!isSidebarOpen);
        setButtonClass("side-button side-button-clicked");
        setTimeout(() => {
            setButtonClass("side-button");
        }, 150);
    }

    function handleHover() {
        setButtonClass("side-button side-button-hover");
    }

    function handleMouseOut() {
        setButtonClass("side-button");
    }

    function toggleDropdown() {
        setDropdownOpen(prevState => !prevState);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <nav className="navbar">
            <div className="navbar-side-button-tag">
                <button
                    className={buttonClass}
                    onClick={handleisSidebarOpen}
                    onMouseOver={handleHover}
                    onMouseLeave={handleMouseOut}
                >
                    <svg focusable="false" viewBox="0 0 24 24">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                    </svg>
                </button>
                <div id="current-tag">{currentTag.charAt(0).toUpperCase() + currentTag.slice(1,)}</div>
            </div>
            <div className="app-logo-div">
                <a id="app" href="/">
                    <img src={logo} alt="logo" />
                    <p>R Notes</p>
                </a>
            </div>
            <div className="user-div">
                {isLoggedIn ? (
                    <div className="profile-container" ref={dropdownRef}>
                        <div
                            className={`profile-initial ${dropdownOpen ? "profile-container-open" : ""}`}
                            onClick={toggleDropdown}
                        >
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <p>{user.username}</p>
                                <button onClick={logoutHandler}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="login-signup">
                        <Link to="/login" id="login-button">Login</Link>
                        <Link to="/signup" id="signup-button">Sign Up</Link>
                    </div>
                )}
            </div>
            <Sidebar isSidebarOpen={isSidebarOpen} totalNotesCount={totalNotesCount} handleisSidebarOpen={handleisSidebarOpen} userId={user._id} currentTag={currentTag} setCurrentTag={setCurrentTag} />
        </nav>
    );
}

export default Navigation;
