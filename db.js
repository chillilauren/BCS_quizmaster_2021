// to get variables from .env file
require('dotenv').config();

// get client
const mysql = require('mysql2');

// create connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'bcs_quizmaster'
});

// console.log to show successful connection
connection.connect(function(error){
    if(!!error) {
        console.log(error);
    } else {
        console.log('Connected!');
    }
});

// create query
function query(sql) {
    const results = connection
        .promise()
        .query(sql)
        .then(([rows]) => {
            return rows;
        })
    return results;
}

module.exports.query = query;