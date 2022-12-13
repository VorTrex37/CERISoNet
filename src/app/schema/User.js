import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const User = new mongoose.Schema({
    _id: Number,
    dentifiant: String,
    password: String,
    nom: String,
    avatar: String,
})

export default mongoose.model('User', User);
