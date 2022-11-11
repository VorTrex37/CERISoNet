import mongoose from 'mongoose';

const Comment = new mongoose.Schema({
    _id: Number,
    date: Date,
    hour: Date,
    body: String,
    createdBy: Number,
    Shared: Number,
    images: {
        url: String,
        title: String,
    },
    likes: Number,
    hashtags: [String],
    comments: [{
        text: String,
        commentedBy: Number,
        date: Date,
        hour: Date
    }]
}, {
    collection: process.env.MONGO_SESSION
})

export default mongoose.model('Comment', Comment);
