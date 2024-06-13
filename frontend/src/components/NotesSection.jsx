import React, { useState, useEffect } from 'react';
import AddNoteForm from './AddNoteForm';
import Notification from './Notification'; // Import the Notification component
import Note from './Note';
import './notes-section.css';

function NotesSection({ isSidebarOpen, user, currentTag, setTotalNotesCount }) {
    const [notes, setNotes] = useState([]);
    const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
    const [addNewNoteButton, setAddNewNoteButton] = useState('');
    const [message, setMessage] = useState('');

    const handleNewNote = () => {
        setAddNewNoteButton('clicked');
        setIsNewNoteOpen(true);
        setTimeout(() => {
            setAddNewNoteButton('');
        }, 150);
    };

    const handleEditNote = (index) => {
        setCurrentNoteIndex(index);
        setIsEditing(true);
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await fetch(`http://localhost:5000/api/notes/${noteId}`, {
                method: 'DELETE',
            });

            const updatedNotes = notes.filter(note => note._id !== noteId);
            setNotes(updatedNotes);
            setTotalNotesCount(updatedNotes.length);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };
    useEffect(() => {
        const fetchNotes = async () => {
            if (user && user._id) {
                try {
                    const response = await fetch(`http://localhost:5000/api/notes/${user._id}`);
                    const data = await response.json();
                    setNotes(data);
                    setTotalNotesCount(data.length);
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            }
        };

        fetchNotes();
    }, [user, setTotalNotesCount]);

    useEffect(() => {
        const fetchNotesByTag = async () => {
            if (user && user._id) {
                try {
                    if (currentTag && currentTag.toLowerCase() !== 'all') {
                        const response = await fetch(`http://localhost:5000/api/notes/${user._id}/tags/${currentTag.toLowerCase()}`);
                        const data = await response.json();
                        setNotes(data);
                    } else {
                        const response = await fetch(`http://localhost:5000/api/notes/${user._id}`);
                        const data = await response.json();
                        setNotes(data);
                        setTotalNotesCount(data.length);
                    }
                } catch (error) {
                    console.error('Error fetching notes by tag:', error);
                }
            }
        };

        fetchNotesByTag();
    }, [user, currentTag, setTotalNotesCount]);

    const handleSaveNote = async (note) => {
        const isNoteEmpty = (note.title.trim() === '' && note.content.trim() === '' && (!note.attachments || note.attachments.length === 0));

        if (isEditing) {
            if (isNoteEmpty) {
                setMessage('Empty note discarded.');
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            }

            if (currentNoteIndex >= 0 && currentNoteIndex < notes.length) {
                if (isNoteEmpty) {
                    try {
                        await fetch(`http://localhost:5000/api/notes/${notes[currentNoteIndex]._id}`, {
                            method: 'DELETE',
                        });

                        const updatedNotes = notes.slice();
                        updatedNotes.splice(currentNoteIndex, 1);
                        setNotes(updatedNotes);
                        setTotalNotesCount(updatedNotes.length);
                    } catch (error) {
                        console.error('Error deleting note:', error);
                    }
                } else {
                    try {
                        const updatedNote = { ...notes[currentNoteIndex], ...note };
                        await fetch(`http://localhost:5000/api/notes/${notes[currentNoteIndex]._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(updatedNote),
                        });
                        const updatedNotes = notes.map((note, index) => (index === currentNoteIndex ? updatedNote : note));
                        setNotes(updatedNotes);
                    } catch (error) {
                        console.error('Error updating note:', error);
                    }
                }
            }
        } else {
            if (isNoteEmpty) {
                setMessage('Empty note discarded.');
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                const newNote = { ...note, userId: user._id };
                try {
                    const response = await fetch('http://localhost:5000/api/notes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newNote),
                    });
                    const data = await response.json();
                    setNotes([...notes, data]);
                    setTotalNotesCount(notes.length + 1);
                } catch (error) {
                    console.error('Error saving new note:', error);
                }
            }
        }
        setIsNewNoteOpen(false);
        setIsEditing(false);
    };

    return (
        <>
            <Notification message={message} /> {/* Add the Notification component */}
            <section
                className="notes-section"
                style={
                    isSidebarOpen
                        ? { transition: '.25s ease-in-out', marginLeft: '230px' }
                        : { transition: '.25s ease-out', marginLeft: '50px' }
                }
            >
                <div className="add-search-etc">
                    <button
                        id="add-note-button"
                        className={`${addNewNoteButton}`}
                        onClick={handleNewNote}
                    >
                        Add New Note
                    </button>
                </div>

                <div className="notes">
                    {notes.map((note, index) => (
                        <Note key={index} index={index} note={note} handleEditNote={handleEditNote} deleteNote={handleDeleteNote} setMessage={setMessage} />
                    ))}
                </div>
            </section>
            {(isNewNoteOpen || isEditing) && (
                <AddNoteForm
                    onSave={handleSaveNote}
                    initialNote={isEditing ? notes[currentNoteIndex] : {}}
                />
            )}
        </>
    );
}

export default NotesSection;
