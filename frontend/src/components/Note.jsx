import React, { useState } from "react";
import { MdDelete, MdWallpaper, MdLock, MdArchive } from "react-icons/md";
import { FaTags, FaEye, FaEyeSlash } from "react-icons/fa";

const soothingColors = [
    '#AED6F1', '#A9DFBF', '#F7DC6F', '#F1948A', '#D2B4DE', '#E59866',
    '#B2BABB', '#5DADE2', '#52BE80', '#F4D03F'
];

function Note({ index, note, handleEditNote, deleteNote, setMessage }) {
    const updatedAt = new Date(note.updatedAt);

    const formattedDate = updatedAt.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).toUpperCase();

    const formattedTime = updatedAt.toLocaleTimeString();

    const [isNoteLocked, setIsNoteLocked] = useState(note.isLocked);
    const [showLockedNote, setShowLockedNote] = useState(!note.isLocked);
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLockingNote, setIsLockingNote] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    async function handleUnlock(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/notes/unlock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ noteId: note._id, password })
            });

            const result = await response.json();
            if (response.status === 200) {
                setShowLockedNote(true);
                setShowPasswordInput(false);
            } else if (response.status === 401) {
                setMessage(result.msg);
                setTimeout(() => setMessage(''), 1000);
            } else {
                console.log(result.msg || 'Error unlocking note');
            }
        } catch (error) {
            console.error('Server error:', error);
        }
        setPassword("");
    }

    async function handleLock(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setTimeout(() => setMessage(''), 1000);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/notes/lock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ noteId: note._id, password })
            });

            const result = await response.json();
            if (response.status === 200) {
                setIsNoteLocked(true);
                setIsLockingNote(false);
                setMessage(result.msg);
                window.location.href = '/';
                setTimeout(() => setMessage(''), 1000);
            } else {
                console.log(result.msg || 'Error locking note');
                setMessage(result.msg || 'Error locking note');
                setTimeout(() => setMessage(''), 1000);
            }
        } catch (error) {
            console.error('Server error:', error);
        }
        setPassword("");
        setConfirmPassword("");
    }

    return (
        <>
            {(isNoteLocked && !showLockedNote) &&
                <div className="locked-note-container" onClick={() => setShowPasswordInput(true)}>
                    {showPasswordInput ?
                        <form className="note-unlock-form" onSubmit={handleUnlock}>
                            <div className="note-password-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                                <span onClick={togglePasswordVisibility} className="note-password-toggle-icon">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <button type="submit">Unlock</button>
                        </form>
                        :
                        <MdLock className="lock-icon" />
                    }
                </div>
            }
            {((isNoteLocked && showLockedNote) || (!isNoteLocked && !isLockingNote)) &&
                <div
                    className="note-container"
                    style={{ backgroundColor: soothingColors[index % soothingColors.length] }}
                >
                    <div className="note" onClick={() => handleEditNote(index)}>
                        <div className="note-tag-and-title">
                            <p id="note-title">{note.title ? note.title : ''}</p>
                            {note.tag && <p id="note-tag">{note.tag.toUpperCase()}</p>}
                        </div>
                        <p className="note-content">{note.content}</p>
                    </div>
                    <div className="note-date-time-container">
                        <p>{formattedDate}</p>
                        <p>{formattedTime}</p>
                    </div>
                    <div className="note-icons">
                        <button data-label="Tags"><FaTags /></button>
                        <div>
                            <label htmlFor="attachment-input" style={{ cursor: 'pointer' }} data-label="Attachments">
                                <MdWallpaper />
                            </label>
                            <input id="attachment-input" type="file" style={{ display: 'none' }} />
                        </div>
                        {isNoteLocked ? (
                            <button data-label="Unlock" onClick={() => setShowLockedNote(false)}>
                                <MdLock />
                            </button>
                        ) : (
                            <button data-label="Lock" onClick={() => setIsLockingNote(true)}>
                                <MdLock />
                            </button>
                        )}
                        <button data-label="Archive"><MdArchive /></button>
                        <button data-label="Delete" id="delete-note-button" onClick={() => deleteNote(note._id, index)}><MdDelete /></button>
                    </div>
                </div>
            }
            {isLockingNote && (
                <div className="note-locking-overlay">
                    <div className="lock-note-form-container">
                        <form className="note-lock-form" onSubmit={handleLock}>
                            <div className="note-password-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                                <span onClick={togglePasswordVisibility} className="note-password-toggle-icon">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className="note-password-container">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm password"
                                    required
                                />
                                <span onClick={toggleConfirmPasswordVisibility} className="note-password-toggle-icon">
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className="locking-note-buttons">
                                <button type="submit" id="locking-note-lock-button">Lock Note</button>
                                <button type="button" id="locking-note-cancel-button" onClick={() => {
                                    setIsLockingNote(false)
                                    setPassword("")
                                    setConfirmPassword("");
                                }
                                }>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Note;
