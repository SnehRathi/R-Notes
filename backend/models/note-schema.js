// models/Note.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    title: {
        type: String,
        trim: true,
    },
    lockedNoteName: {
        type: String,
        trim: true,
        required: function() {
            return this.isLocked; // lockedNoteName is required if the note is locked
        }
    },
    content: {
        type: String,
    },
    isLocked: {
        type: Boolean,
        default: false,
    },
    passwordHash: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
            index: true,
        },
    ],
    attachments: [
        {
            fileName: {
                type: String,
                trim: true,
            },
            url: {
                type: String,
            },
            type: {
                type: String,
                enum: ['image', 'file', 'other'],
            },
        },
    ],
    isArchived: {
        type: Boolean,
        default: false,
    },
});

// Middleware to update the `updatedAt` field on save and update
noteSchema.pre('save', function (next) {
    this.updatedAt = new Date(Date.now());
    next();
});

noteSchema.pre('findOneAndUpdate', function (next) {
    this._update.updatedAt = new Date(Date.now());
    next();
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
