import React, { useState, useEffect } from "react";
import './sidebar.css';
import Tag from "./Tag";

function Sidebar({ isSidebarOpen, totalNotesCount, handleisSidebarOpen, userId, currentTag, setCurrentTag }) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        async function fetchTags() {
            try {
                if (userId) {
                    const response = await fetch(`http://localhost:5000/api/notes/${userId}/tags`);
                    const data = await response.json();
                    setTags(data);
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        }

        fetchTags();
    }, [userId]);

    const sidebarStyle = {
        transition: '.25s ease-in-out',
        left: isSidebarOpen ? '0' : '-230px'
    };

    return (
        <div className="sidebar-container" style={sidebarStyle}>
            <div className="sidebar-header">
                <button className="sidebar-button" onClick={handleisSidebarOpen}>
                    <svg focusable="false" viewBox="0 0 24 24">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                    </svg>
                </button>
                <div id="current-tag">{currentTag.charAt(0).toUpperCase() + currentTag.slice(1,)}</div>
            </div>
            <div className="sidebar-div">
                <div id="sidebar-type-container">
                    <div className={`note-type-container ${currentTag === 'All' ? 'active-tag' : ''}`} onClick={() => setCurrentTag('All')}>
                        <div className="note-type">
                            <span className="bullet" style={{ backgroundColor: "white" }}></span>
                            <span className="tagname">All</span>
                            <div className="note-count" style={{ backgroundColor: "white" }}>
                                <p>{totalNotesCount}</p>
                            </div>
                        </div>
                    </div>
                    {tags.map((tag, index) => (
                        <Tag
                            key={tag._id}
                            tag={tag}
                            index={index}
                            setCurrentTag={setCurrentTag}
                            currentTag={currentTag} // Pass currentTag prop to Tag component
                        />
                    ))}
                </div>
            </div>
            <div className="sidebar-bottom">
                <p>Total Notes: {totalNotesCount}</p>
            </div>
        </div >
    );
}

export default Sidebar;
