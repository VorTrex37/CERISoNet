import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const Comment = new mongoose.Schema({
    comments: [{
        text: String,
        commentedBy: Number,
        date: String,
        hour: String
    }]
}, {
    collection: process.env.MONGO_URI_USER
})

export default mongoose.model('Comment', Comment);
