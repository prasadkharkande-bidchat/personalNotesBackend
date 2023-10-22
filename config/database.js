require("dotenv").config;


const{Pool, client} = require('pg');

const pool = new Pool({
    user: `${process.env.DB_USER}`,
    host: `${process.env.DB_HOST}`,
    database: `${process.env.DATABASE}`,
    password: `${process.env.DB_PASSWORD}`,
    port: process.env.DB_PORT
})
//process.env.PASSWORD

module.exports = pool;
// (async() => {
//     try{
//         const client = await pool.connect();
//     const {rows} = await client.query('SELECT current_user');
//     console.log("-=-=- rows : ", rows);
//     }catch(err){
//         console.log("-=-=-=err : ", err);
//     }
    
// })();