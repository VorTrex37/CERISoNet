import dotenv from 'dotenv';
import {PostgresDB} from '../../database/PostgresDB.js'
import { User } from '../models/User.js'
import crypto from 'crypto';

dotenv.config();



export class UserController
{
    async getAllUsers()
    {
            const connect = await PostgresDB.connectDB();
            const response = await connect.query({text : 'SELECT * FROM utilisateurs'});

            if (!response || !response.rows)
            {
                return 'Query execution error';
            }

            const users = [];

            response.rows.forEach((user) => {
                users.push(new User(
                   user.id,
                   user.identifiant,
                   user.pass,
                   user.nom,
                   user.prenom,
                   user.avatar,
                   user.status,
                   user.birthday,
                   ));
            });

            return users;
    };

    async getUser(userId)
    {
        if (!Number(userId) && userId !== '0')
        {
            return 'Wrong id';
        }

        const connect = await PostgresDB.connectDB();
        const response = await connect.query({text : 'SELECT * FROM utilisateurs WHERE id = $1',
        values : [userId]});

        if (!response || !response.rows || !response.rows[0])
        {
            return 'Query execution error';
        }

        const user = response.rows[0]

        return new User(
            user.id,
            user.identifiant,
            user.pass,
            user.nom,
            user.prenom,
            user.avatar,
            user.status,
            user.birthday
            );
    };

    hash (pass) {
        return crypto.createHash('sha1').update(pass).digest('hex');
    };


    async userConnection(username, password)
    {
        password = this.hash(password);

        const connect = await PostgresDB.connectDB();

        const response = await connect.query({
            text : 'SELECT * FROM utilisateurs WHERE identifiant = $1 AND pass = $2',
            values : [username, password]
        });

        if (!response || !response.rows || !response.rows[0])
        {
            return 'Query execution error';
        }

        const user = response.rows[0]

        return new User(
            user.id,
            user.identifiant,
            user.pass,
            user.nom,
            user.prenom,
            user.avatar,
            user.status,
            user.birthday
        );
    };
}
