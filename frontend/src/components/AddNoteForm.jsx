import React, { useState, useEffect, useRef } from 'react';
import { FaArchive, FaLock } from "react-icons/fa";
import { FaPaperclip, FaTags } from "react-icons/fa6";

function AddNoteForm({ onSave, initialNote }) {
    const [note, setNote] = useState(initialNote || {});
    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    const titleRef = useRef(null);

    const handleSave = (e) => {
        e.preventDefault();
        const updatedNote = {
            ...note,
            content: contentRef.current.innerText,
            title: titleRef.current.innerText,
        };
        onSave(updatedNote);
    };

    const handleOverlayClick = (e) => {
        if (overlayRef.current && e.target === overlayRef.current) {
            handleSave(e);
        }
    };

    useEffect(() => {
        if (initialNote) {
            setNote(initialNote);
            if (contentRef.current) {
                contentRef.current.innerText = initialNote.content || '';
            }
            if (titleRef.current) {
                titleRef.current.innerText = initialNote.title || '';
            }
        }
    }, [initialNote]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNote(prevNote => ({ ...prevNote, [name]: value }));
    };

    const handleContentChange = () => {
        if (contentRef.current) {
            setNote(prevNote => ({ ...prevNote, content: contentRef.current.innerText }));
        }
    };

    const handleTitleChange = () => {
        if (titleRef.current) {
            setNote(prevNote => ({ ...prevNote, title: titleRef.current.innerText }));
        }
    };

    return (
        <div className="overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="overlay-content">
                <form onSubmit={handleSave}>
                    <div
                        contentEditable
                        ref={titleRef}
                        className="title-input editable-placeholder"
                        onInput={handleTitleChange}
                        data-placeholder="Enter title here"
                    ></div>
                    <div
                        id="note-content-editable"
                        contentEditable
                        ref={contentRef}
                        onInput={handleContentChange}
                        className="editable-div editable-placeholder"
                        data-placeholder="Enter content here"
                    ></div>
                    <div className="note-form-icons">
                        <label className="icon-label" data-label="Locked">
                            <FaLock />
                            <input
                                type="checkbox"
                                name="isLocked"
                                checked={note.isLocked || false}
                                onChange={(e) => handleChange({ target: { name: 'isLocked', value: e.target.checked } })}
                                className="hidden-input"
                            />
                        </label>
                        <label className="icon-label" data-label="Tags">
                            <FaTags />
                            <input
                                type="text"
                                name="tags"
                                value={note.tags || ''}
                                onChange={handleChange}
                                placeholder="Tags (comma separated)"
                                className="hidden-input"
                            />
                        </label>
                        <label className="icon-label" data-label="Attachments">
                            <FaPaperclip />
                            <input
                                type="file"
                                name="attachments"
                                multiple
                                onChange={(e) => handleChange({ target: { name: 'attachments', value: e.target.files } })}
                                className="hidden-input"
                            />
                        </label>
                        <label className="icon-label" data-label="Archived">
                            <FaArchive />
                            <input
                                type="checkbox"
                                name="isArchived"
                                checked={note.isArchived || false}
                                onChange={(e) => handleChange({ target: { name: 'isArchived', value: e.target.checked } })}
                                className="hidden-input"
                            />
                        </label>
                    </div>
                    <button type="submit" id='save-button'>Save</button>
                </form>
            </div>
        </div>
    );
}

export default AddNoteForm;
