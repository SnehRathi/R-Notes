const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getNotes, createNote, updateNote, getNotesByTag, deleteNote, getTags, createTag, unlockNote,lockNote } = require('../controllers/noteController');

// Fetch notes for a given user
router.get('/:userId', getNotes);

// Create a new note
router.post(
    '/',
    [
        check('userId', 'User ID is required').not().isEmpty(),
        // No check for title as it is not required
    ],
    createNote
);

router.put(
    '/:noteId',
    [
        check('content', 'Content is required').not().isEmpty()
    ],
    updateNote
);

// Delete a note
router.delete('/:noteId', deleteNote);

// Fetch notes by tag for a given user
router.get('/:userId/tags/:tag', getNotesByTag);

// Fetch tags of the given user
router.get('/:userId/tags', getTags);

// Create a tag
router.post('/:userId/tags', createTag);

// Unlock a note
router.post(
    '/unlock',
    [
        check('noteId', 'Note ID is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty()
    ],
    unlockNote
);

router.post(
    '/lock',
    [
        check('noteId', 'Note ID is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty()
    ],
    lockNote
);


module.exports = router;
