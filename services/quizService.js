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
    const result = await db.query(preparedSql);

    console.log("new quiz", result)
}

async function getQuizzes() {
    const sql = "SELECT * FROM `quizzes`";
    const result = await db.query(sql);

    console.log("quizzes", result)

}

// export functions
module.exports.createQuiz = createQuiz;
module.exports.getQuizzes = getQuizzes;
