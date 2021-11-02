// get router
const express = require('express');
const router = express.Router();

// get quiz functions
const quizService = require('../services/quizService')

// get quizzes page
router.get('/', async (req, res) => {
    try {
        const quizzes = await quizService.getQuizzes();

        console.log("QQQ", quizzes)
    } catch(err) {
        console.error(err)
    }
});

// get create quiz page
router.get('/create', async (req, res) => {
    try {
        res.render('quizzes/create')
    } catch(err) {
        console.error(err)
    }
});

// export router
module.exports = router;