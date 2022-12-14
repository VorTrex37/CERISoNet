// Importation des dépendandes de modules
import express from 'express'
import fs from 'fs';
import dotenv from 'dotenv'
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { UserController } from './src/app/controllers/UserController.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import session from 'express-session';
import { sessionOptions } from './src/database/MongoSession.js'
import { PostController } from "./src/app/controllers/PostController.js";
import {Server} from "socket.io";

console.log(`${process.env.APP_NAME}`)
console.log(`Ready on ${process.env.NODE_ENV} mode`)
console.log(`API : ${process.env.API_URL}`)

// Liste des variables
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const appAng = express()
const options = {
    key: fs.readFileSync('keys/key.pem'),
    cert: fs.readFileSync('keys/cert.pem')
};
const userController = new UserController();
const postController = new PostController();

dotenv.config()
app.use(cors());
app.use(express.json());
app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src/public'));
appAng.use(express.static(__dirname + '/CERISoNet/dist/ceriso-net/'));

async function initializePosts(post)
{
    post["createdBy"] = await userController.getUser(post["createdBy"]);

    if (post["Shared"])
    {
        post["Shared"] = await postController.getPostById(post["_id"]);
    }

    for (let comment of post["comments"]) {
        comment["commentedBy"] = await userController.getUser(comment["commentedBy"])
    }

    if (post["images"] === undefined) {
        post.images = {}
    }
    if (post["hashtags"] === undefined) {
        post.hashtags = {}
    }
    if (post["likes"] === undefined) {
        post.likes = 0;
    }
}

//Routes
//Page de connexion (Affichage de la page index.html)
app.get('/', async(req, res) => {
    try {
        res.sendFile(__dirname + '/index.html');
    } catch (e) {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

//Permet de récupérer les informations de l'utilisateur
app.post('/login', async(req, res) => {
    try {
        if (!req.body.username || !req.body.password)
        {
            return res.status(400).json({ message: 'Identifiant et Mot de passe sont requis' });
        }
        else
        {
            const username = req.body.username;
            const password = req.body.password;

            // Récupération des données de l'utilisateur sur la base PG
            const user = await userController.userConnection(username, password);

            if (user && user.identifiant && user.password)
            {
                console.log('Username : ' + user.identifiant + ' & Password : ' + user.password);

                // Génération du token
                let token = jwt.sign({ data: user }, 'secret')

                // Sauvegarde des données de sessions
                req.session.isConnected = true;
                req.session.username = user.identifiant;

                await userController.updateStatus(user._id, 1);

                console.log('Id : ' + req.session.id + ' expire dans ' + req.session.cookie.maxAge);

                return res.status(200).json({data: user, token: token });
            }
            else
            {
                console.log('Username : ' + username + ' & Password : ' + password);
                return res.status(401).json({message: 'Identifiant ou Mot de passe incorrect(s)' });
            }
        }
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.get('/users', async(req, res) => {
    try
    {
        const users = await userController.getAllUsers();
        res.status(200).json(users);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.get('/logout/user/:id', async(req, res) => {
    try
    {
        await userController.updateStatus(req.params.id, 0);
        return res.status(200).json();
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.get('/user/:id', async(req, res) => {
    try
    {
        if (!req.params.id)
        {
            return res.status(400).json({ message: 'Id requis' });
        }
        let userId = req.params.id;
        const user = await userController.getUser(userId);
        res.status(200).json(user);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.get('/posts', async(req, res) => {
    try
    {
        const posts = await postController.getPosts();

        for (let post of posts)
        {
            await initializePosts(post)
        }

        res.status(200).json(posts);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.get('/getpost/:id', async(req, res) => {
    try
    {
        const postId = req.params.id;
        const post = await postController.getPostById(postId);
        res.status(200).json(post);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.post('/post/update/:id', async(req, res) => {
    try
    {
        if (!req.body.status)
        {
            return res.status(400).json({ message: "Erreur status non défini" });

        }

        if (req.body.status === 'comment')
        {
            if (!req.body.id || !req.body.text || !req.body.commentedBy || !req.body.date || !req.body.hour)
            {
                return res.status(400).json({ message: "Erreur certaines informations n'ont pas été transmises" });
            }

            const postId = req.body.id;
            const text =  req.body.text;
            const commentedBy = req.body.commentedBy;
            const date = req.body.date;
            const hour = req.body.hour;

            const comment = {
                text : text,
                commentedBy : commentedBy,
                date : date,
                hour : hour,
            };

            const postUpdate = await postController.addComment(postId, comment)

            return res.status(200).json(postUpdate);
        }
        if (req.body.status === 'likes_plus')
        {
            if (!req.body.id)
            {
                return res.status(400).json({ message: "Erreur certaines informations n'ont pas été transmises" });
            }

            const postId = req.body.id;

            const postUpdate = await postController.addLike(postId)

            return res.status(200).json(postUpdate);
        }
        if (req.body.status === 'likes_moins')
        {
            if (!req.body.id)
            {
                return res.status(400).json({ message: "Erreur certaines informations n'ont pas été transmises" });
            }

            const postId = req.body.id;

            const postUpdate = await postController.suppLike(postId)

            res.status(200).json(postUpdate);
        }
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.post('/post/create', async(req, res) => {
    try
    {
        if (!req.body.date || !req.body.hour || !req.body.body || !req.body.createdBy || !req.body.shared || !req.body.images  || !req.body.hashtags )
        {
            return res.status(400).json({ message: "Erreur certaines informations n'ont pas été transmises" });
        }

        const date = req.body.date;
        const hour = req.body.hour;
        const body =  req.body.body;
        const createdBy =  req.body.createdBy;
        const images =  req.body.images;
        const likes =  0;
        const hashtags =  req.body.hashtags;
        const shared = req.body.shared;
        const id =  await postController.generateId();

        const post = {
            _id: id,
            date : date,
            hour : hour,
            body : body,
            createdBy : createdBy,
            images: images,
            Shared: shared,
            likes : likes,
            hashtags: hashtags
        };

        const sharedPost = await postController.insertPost(post)

        res.status(200).json(sharedPost);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.post('/post/filter', async(req, res) => {
    try
    {
        if (!req.body.createdBy)
        {
            return res.status(400).json({ message: "Erreur l'information n'a pas été transmise" });
        }

        const createdBy = req.body.createdBy;

        const postFilter = await postController.findByCreator(createdBy);

        if (postFilter.length === 0)
        {
            res.status(401).json({ message: "Aucun post trouvé" });
            return;
        }

        for (let post of postFilter)
        {
            await initializePosts(post)
        }

        res.status(200).json(postFilter);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.post('/post/sort', async(req, res) => {
    try
    {
        if (!req.body.sort)
        {
            return res.status(400).json({ message: "Erreur l'information n'a pas été transmise" });
        }

        const sort = req.body.sort;

        let postSort;

        if (sort === 'date_ascending')
        {
            postSort = await postController.findSortByDateAsc();
        }
        if (sort === 'date_descending')
        {
            postSort = await postController.findSortByDateDesc();
        }
        if (sort === 'like_ascending')
        {
            postSort = await postController.findSortByLikeAsc();
        }
        if (sort === 'like_descending')
        {
            postSort = await postController.findSortByLikeDesc();

        }

        if (postSort.length === 0)
        {
            return res.status(401).json({ message: "Erreur aucun post trouvé" });
        }

        for (let post of postSort)
        {
            await initializePosts(post)
        }

        res.status(200).json(postSort);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

appAng.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

// Création et lancement du serveur https
const backEnd = https.createServer(options, app).listen(process.env.PORTEX, () => {
    console.log(`Example app listening on port ${process.env.PORTEX}`)
    setInterval(async() => {
        io.emit('users-logged', await userController.getUsersLogged());
    }, 3000);
});

const io = new Server(backEnd, { cors: { origin: '*' } });
https.createServer(options, appAng).listen(process.env.PORTA, () => {
    console.log(`Example app listening on port ${process.env.PORTA}`)
});
