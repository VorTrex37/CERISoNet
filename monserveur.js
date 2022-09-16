/**
 * Module dependencies.
 */
import express from 'express'
import fs from 'fs';
import dotenv from 'dotenv'
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/*List of variables*/
dotenv.config()
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);
const app = express()
const options = {
    key: fs.readFileSync('keys/key.pem'),
    cert: fs.readFileSync('keys/cert.pem')
};

//
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//Routes
//Page de connexion
app.get('/', async(req, res) => {
    try {
        res.sendFile(__dirname + '/index.html');
    } catch (err) {
        res.status(500).send({ errName: err.name, errMessage: err.message });
    }
});

//Permet de récupérer les informations de l'utilisateur
app.post('/login', function(req, res) {
    try {
        if (!req.body.login || !req.body.password) {
            return res.status(400).json({ message: 'Error ! Login and password required' })
        } else {
            console.log('Username : ' + req.body.login + ' & Password : ' + req.body.password);
            res.redirect('/');
        }
    } catch (err) {
        res.status(500).send({ errName: err.name, errMessage: err.message });
    }
});

https.createServer(options, app).listen(process.env.PORTEX, () => {
    console.log(`Example app listening on port ${process.env.PORTEX}`)
});

// app.listen(process.env.PORT, () => {
//     console.log(`Example app listening on port ${process.env.PORT}`)
// })