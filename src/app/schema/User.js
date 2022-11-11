import mongoose from 'mongoose';

const User = new mongoose.Schema({
    _id: Number,
    identifiant: String,
    pass: String,
    nom: String,
    prenom: String,
    avatar: String,
    status: Boolean,
    birthday: Date,
}, {
    collection: process.env.MONGO_SESSION
})

export default mongoose.model('User', User);
