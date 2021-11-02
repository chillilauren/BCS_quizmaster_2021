// get client
const mysql = require('mysql2');

// get database
const db = require('../db');

// create a quiz
async function createQuiz(quiz) {
    // get date added
    const now = new Date();
    const currentDateStr = now.toDateString();

    // query
    const sql = "INSERT INTO `quizzes` (quiz_title, date_created) VALUES (?, ?)";
    const inserts = [quiz.title, currentDateStr];
    const preparedSql = mysql.format(sql, inserts);

    await db.query(preparedSql);
}

async function getQuizzes() {
    const sql = "SELECT * FROM `quizzes`";
    return await db.query(sql);
}

// get single quiz
async function getSingleQuiz(quizId) {
    const sql = "SELECT * FROM `quizzes` WHERE quiz_id = ?";
    const inserts = [quizId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

// get questions for quiz
async function getQuestions(quizId) {
    const sql = "SELECT * FROM `questions` WHERE quiz_id = ?";
    const inserts = [quizId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}


// export functions
module.exports.createQuiz = createQuiz;
module.exports.getQuizzes = getQuizzes;
module.exports.getSingleQuiz = getSingleQuiz;
module.exports.getQuestions = getQuestions;
