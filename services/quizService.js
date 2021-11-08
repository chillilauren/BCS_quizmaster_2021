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

// get all quizzes
async function getQuizzes() {
    const sql = "SELECT * FROM `quizzes`";
    return await db.query(sql);
}

// get single quiz using quiz id
async function getSingleQuiz(quizId) {
    const sql = "SELECT * FROM `quizzes` WHERE quiz_id = ?";
    const inserts = [quizId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

// add question to quiz using quiz id
async function addQuestion(quizId, question) {
    const sql = "INSERT INTO `questions` (question, option_a, option_b, option_c, option_d, option_e, correct_answer, quiz_id) VALUES (?,?,?,?,?,?,?,?) ";
    const inserts = [
        question.question,
        question.opt_a,
        question.opt_b,
        question.opt_c,
        question.opt_d,
        question.opt_e,
        question.correct_answer,
        quizId,
        // question.order_no
    ];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}

// delete quiz using quiz id
async function deleteQuiz(quizId) {
    const sql = "DELETE FROM `quizzes` WHERE quiz_id = ?";
    const inserts = [quizId];
    const preparedSql = mysql.format(sql, inserts);

    return await db.query(preparedSql);
}


// export functions
module.exports.createQuiz = createQuiz;
module.exports.getQuizzes = getQuizzes;
module.exports.getSingleQuiz = getSingleQuiz;
module.exports.addQuestion = addQuestion;
module.exports.deleteQuiz = deleteQuiz;

