const mongoose = require('mongoose');
const { Schema } = mongoose;

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    noteCount: {
        type: Number,
        default: 0,
    },
});

// Create a compound index on name and userId
tagSchema.index({ name: 1, userId: 1 }, { unique: true });

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
