// get client
const mysql = require('mysql2');

// get database
const db = require('../db');

// get package to handle passwords
const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function createUser(user) {
    const sql = 'INSERT INTO `users` (username, password, role) VALUES (?,?,?)';
    const hashedPassword = await hashPassword(user.password);
    const inserts = [user.username, hashedPassword, user.role];
    const preparedSql = mysql.format(sql, inserts);

    await db.query(preparedSql);
}

async function validateLogin(user) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const inserts = [user.username];
    const preparedSql = mysql.format(sql, inserts);
    const result = await db.query(preparedSql);

    if (!result || result.length != 1) {
        return false;
    }

    const passwordCorrect = bcrypt.compareSync(user.password, result[0].password)
    
    if (!passwordCorrect) {
        return passwordCorrect;
    }
    return result[0];
}

// export functions
module.exports.createUser = createUser;
module.exports.validateLogin = validateLogin;
