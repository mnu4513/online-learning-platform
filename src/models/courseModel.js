const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    videoUrl: {
        type: String,
        trim: true
    },
    topic: {
        type: ["String"],
        trim: true
    },
    duration: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Course', courseSchema);