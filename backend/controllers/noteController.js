const Note = require('../models/note-schema');
const Tag = require('../models/tag');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


// Controller to fetch notes for a given user
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.params.userId });
        res.json(notes);
    } catch (error) {
        console.error("hello" + error.message);
        res.status(500).send('Server Error');
    }
};

// Controller to create a new note
exports.createNote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, title, content, isLocked, password, tags, attachments, isArchived } = req.body;

    try {
        const currentTime = new Date(Date.now());

        let passwordHash = null;
        if (isLocked && password) {
            const salt = await bcrypt.genSalt(10);
            passwordHash = await bcrypt.hash(password, salt);
        }

        const newNote = new Note({
            userId,
            title,
            content,
            isLocked,
            passwordHash,
            tags,
            attachments,
            isArchived,
            createdAt: currentTime,
            updatedAt: currentTime
        });

        const note = await newNote.save();
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};


// Update a created note
exports.updateNote = async (req, res) => {
    const { noteId } = req.params;
    const { title, content, isLocked, password, tags, attachments, isArchived } = req.body;
    const updatedAt = new Date(Date.now());

    let passwordHash = null;
    if (isLocked && password) {
        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(password, salt);
    }
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content, isLocked, updatedAt, passwordHash, tags, attachments, isArchived },
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: 'Error updating note' });
    }
};


exports.deleteNote = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const deletedNote = await Note.findByIdAndDelete(noteId);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error });
    }
};

exports.unlockNote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { noteId, password } = req.body;

    try {
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        if (!note.isLocked) {
            return res.status(400).json({ msg: 'Note is not locked' });
        }

        const isMatch = await bcrypt.compare(password, note.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ msg: 'Incorrect password' });
        }

        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

// Controller to lock a note
exports.lockNote = async (req, res) => {
    const { noteId, password } = req.body;

    try {
        const note = await Note.findById(noteId);

        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        if (note.isLocked) {
            return res.status(400).json({ msg: 'Note is already locked' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        note.isLocked = true;
        note.passwordHash = passwordHash;
        await note.save();

        res.status(200).json({ msg: 'Note locked successfully', note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};


exports.getNotesByTag = async (req, res) => {
    const { userId, tag } = req.params;
    try {
        const notes = await Note.find({ userId, tag });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notes' });
    }
};

exports.getTags = async (req, res) => {
    const { userId } = req.params;
    try {
        const tags = await Tag.find({ userId: userId });
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tags' });
    }
}

exports.createTag = async (req, res) => {
    const { userId } = req.params;
    let { name } = req.body;

    try {
        // Check if the tag already exists for the user
        const existingTag = await Tag.findOne({ name: name.toLowerCase(), userId });
        if (existingTag) {
            return res.status(400).json({ error: 'Tag already exists for this user' });
        }

        // Convert tag name to lowercase
        name = name.toLowerCase();

        const tag = new Tag({ name, userId });
        await tag.save();
        res.status(201).json(tag);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};