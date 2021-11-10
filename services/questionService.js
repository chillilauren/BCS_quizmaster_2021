// get client
const mysql = require('mysql2');

// get database
const db = require('../db');

// get all questions for quiz using quiz id
async function getAllQuestions(quizId) {
    // build query
    const sql = "SELECT * FROM `questions` WHERE quiz_id = ?";
    const inserts = [quizId];
    const preparedSql = mysql.format(sql, inserts);
    let questions = await db.query(preparedSql);

    // sorts questions by questoin id
    return questions = questions.sort((a,b)=> (a.question_id > b.question_id ? 1 : -1));
}

// get single question using question id
async function getQuestion(questionId) {
    // build query
    const sql = "SELECT question, quiz_id FROM `questions` WHERE question_id = ?";
    const inserts = [questionId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

// delete questions using question id
async function deleteQuestion(questionId) {
    // build query
    const sql = "DELETE FROM `questions` WHERE question_id = ?";
    const inserts = [questionId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

// get answers for single questions using question id
async function getAnswers(questionId) {
    // build query
    const sql = "SELECT option_a, option_b, option_c, option_d, option_e, correct_answer FROM `questions` WHERE question_id = ?";
    const inserts = [questionId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

// update answers for question using question id
async function updateQuestion(question, questionId) {
    // build query
    const sql = "UPDATE `questions` SET question=?, option_a=?, option_b=?, option_c=?, option_d=?, option_e=?, correct_answer=? WHERE question_id = ?";
    const inserts = [
        question.question,
        question.opt_a,
        question.opt_b,
        question.opt_c,
        question.opt_d,
        question.opt_e,
        question.correct_answer,
        questionId
    ];
    const preparedSql = mysql.format(sql, inserts);

    await db.query(preparedSql);
}

module.exports.getAllQuestions = getAllQuestions;
module.exports.getQuestion = getQuestion;
module.exports.getAnswers = getAnswers;
module.exports.updateQuestion = updateQuestion;
module.exports.deleteQuestion = deleteQuestion;

