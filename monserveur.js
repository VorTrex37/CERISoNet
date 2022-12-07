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
            res.status(400).json({ message: 'Identifiant et Mot de passe sont requis' });
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

                console.log('Id : ' + req.session.id + ' expire dans ' + req.session.cookie.maxAge);

                res.status(200).json({data: user, token: token });
            }
            else
            {
                console.log('Username : ' + username + ' & Password : ' + password);
                res.status(401).json({message: 'Identifiant ou Mot de passe incorrect(s)' });
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

app.get('/user/:id', async(req, res) => {
    try
    {
        let userId = req.params.id;
        const users = await userController.getUser(userId);
        res.status(200).json(users);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.get('/posts/', async(req, res) => {
    try
    {
        const posts = await postController.getPosts();
        res.status(200).json(posts);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.get('/post/:id', async(req, res) => {
    try
    {
        let postId = req.params.id;
        const posts = await postController.getPostById(postId);
        res.status(200).json(posts);
    }
    catch (e)
    {
        res.status(500).send({ errName: e.name, errMessage: e.message });
    }
});

app.get('/post/update:id', async(req, res) => {
    try
    {
        let postId = req.params.id;
        const posts = await postController.getPostById(postId);

        res.status(200).json(posts);
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
https.createServer(options, app).listen(process.env.PORTEX, () => {
    console.log(`Example app listening on port ${process.env.PORTEX}`)
});

https.createServer(options, appAng).listen(process.env.PORTA, () => {
    console.log(`Example app listening on port ${process.env.PORTA}`)
});
