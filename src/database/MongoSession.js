import session from 'express-session';
import connectMongo  from "connect-mongodb-session";

const MongoStore = connectMongo(session);

export const sessionOptions = {
    secret:  process.env.MONGO_SECRET,
    saveUninitialized: false,
    resave: false,
    store : new MongoStore({
        uri: process.env.MONGO_URI,
        collection: process.env.MONGO_SESSION,
        touchAfter: (24 * 3600)
    }),
    cookie : {maxAge : (24 * 3600 * 1000) },
}
