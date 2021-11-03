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

async function getQuestion(questionId) {
    const sql = "SELECT question, quiz_id FROM `questions` WHERE question_id = ?";
    const inserts = [questionId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

async function deleteQuestion(questionId) {
    const sql = "DELETE FROM `questions` WHERE question_id = ?";
    const inserts = [questionId];
    const preparedSql = mysql.format(sql, inserts);
    // console.log("deleting", preparedSql);

    return await db.query(preparedSql);
}

async function getAnswers(questionId) {
    const sql = "SELECT option_a, option_b, option_c, option_d, option_e, correct_answer FROM `questions` WHERE question_id = ?";
    const inserts = [questionId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

async function updateAnswers(answers, questionId) {
    const sql = "UPDATE `questions` SET option_a=?, option_b=?, option_c=?, option_d=?, option_e=?, correct_answer=? WHERE question_id = ?";
    const inserts = [
        answers.opt_a,
        answers.opt_b,
        answers.opt_c,
        answers.opt_d,
        answers.opt_e,
        answers.correct_answer,
        questionId
    ];
    const preparedSql = mysql.format(sql, inserts);

    await db.query(preparedSql);
}

module.exports.getAllQuestions = getAllQuestions;
module.exports.getQuestion = getQuestion;
module.exports.getAnswers = getAnswers;
module.exports.updateAnswers = updateAnswers;
module.exports.deleteQuestion = deleteQuestion;

