import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export class MongoDB {
    static async connectDB() {
        if (MongoDB.MongoClient == null) {
            try {
                const mongoURI = process.env.MONGO_URI;
                MongoDB.MongoClient = await mongoose.connect(mongoURI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                console.log("Connection to Mongo DB successful");
            } catch (e) {
                console.error(e);
                console.error("Connection to Mongo DB failed");
                process.exit(-1);
            }
        }
        return MongoDB.MongoClient;
    }
}
