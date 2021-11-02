// get client
const mysql = require('mysql2');

// get database
const db = require('../db');

// get questions for quiz
async function getAllQuestions(quizId) {
    const sql = "SELECT * FROM `questions` WHERE quiz_id = ?";
    const inserts = [quizId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

async function getQuestionData(questionId) {
    const sql = "SELECT * FROM `questions` WHERE question_id = ?";
    const inserts = [questionId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

module.exports.getAllQuestions = getAllQuestions;
module.exports.getQuestionData = getQuestionData;

