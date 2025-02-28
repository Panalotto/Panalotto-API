import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

    // api_secret_key: process.env.API_SECRET_KEY,
    port: process.env.DB_PORT || 3306,
});

export { connection }