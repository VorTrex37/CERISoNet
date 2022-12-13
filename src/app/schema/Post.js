import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const Post = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    date:{
        type: String,
        required: true,
    } ,
    hour:{
        type: String,
        required: true,
    },
    body:{
        type: String,
        required: true,
    },
    createdBy:{
        type: Number,
        required: true,
    },
    Shared: {
        type: Number,
    },
    images: {
        url: {
            type: String,
        },
        title: {
            type: String,
        },
    },
    likes:{
        type: Number,
        required: true,
    },
    hashtags:{
        type: [String],
    },
    comments: [{
        text: {
            type: String,
        },
        commentedBy: {
            type: Number,
        },
        date: {
            type: String,
        },
        hour: {
            type: String,
        },
    }]
}, {
    collection: process.env.MONGO_URI_USER
})

export default mongoose.model('Post', Post);
