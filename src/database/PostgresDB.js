import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export class PostgresDB {
    static async connectDB() {
        if (PostgresDB.PostgresClient == null) {
            try {
                const pool = new pg.Pool({
                    user: process.env.PG_USER,
                    host: process.env.PG_HOST,
                    database: process.env.PG_DATABASE,
                    password: process.env.PG_PASSWORD,
                    port: process.env.PG_PORT
                });
                PostgresDB.PostgresClient = await pool.connect();
                console.log("Connection to PG DB successful");
            } catch (e) {
                console.error(e);
                console.error("Connection to PG DB failed");
                process.exit(-1);
            }
        }
        return PostgresDB.PostgresClient;
    }
}
