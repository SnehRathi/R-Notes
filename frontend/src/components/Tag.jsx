import React, { useState } from "react";
// import './tag.css'; // Ensure to import your CSS file for Tag styles

const colors = [
    "white", "rgb(235 255 157)", "rgb(151 255 151)", "#FFB3E6", "#B3B3FF", "#FFB3FF", "#B3FFFF",
    "#FFD1B3", "#B3FFD1", "#D1B3FF", "#FFB3D1", "#D1FFB3", "#B3D1FF"
];

const Tag = ({ tag, setCurrentTag, index, currentTag }) => {
    const { name, count } = tag;
    const [isHovered, setIsHovered] = useState(false);

    const tagStyle = {
        backgroundColor: colors[(index + 1) % colors.length] // Using _id for color variation
    };

    const handleTagClick = () => {
        setCurrentTag(tag.name.toLowerCase());
    };

    return (
        <div className={`note-type-container ${currentTag === name ? 'active-tag' : ''}`}
            onClick={handleTagClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div className="note-type">
                <span className="bullet" style={{ backgroundColor: isHovered ? 'white' : tagStyle.backgroundColor }}></span>
                <span className="tagname">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                <div className="note-count" style={{ backgroundColor: isHovered ? 'white' : tagStyle.backgroundColor }}>
                    <p>{count}</p>
                </div>
            </div>
        </div>
    );
};

export default Tag;
