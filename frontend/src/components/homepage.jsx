import { React, useState } from "react";
import NotesSection from "./NotesSection";
import './notes-section.css';
import Navigation from "./Navigation";

function Homepage({ user, isLoggedIn, logoutHandler }) {
    const [currentTag, setCurrentTag] = useState('all');
    const [totalNotesCount, setTotalNotesCount] = useState();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <>
            <Navigation user={user} isLoggedIn={isLoggedIn} logoutHandler={logoutHandler} setCurrentTag={setCurrentTag} currentTag={currentTag}totalNotesCount={totalNotesCount} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
            <NotesSection user={user} currentTag={currentTag} isSidebarOpen={isSidebarOpen} setTotalNotesCount={setTotalNotesCount} />
        </>
    )
}
export default Homepage;