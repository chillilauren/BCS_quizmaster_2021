// get router
const express = require('express');
const router = express.Router();

// get quiz functions
const quizService = require('../services/quizService')

// get question functions
const questionService = require('../services/questionService');

// get quizzes page
router.get('/', async (req, res) => {
    try {
        // query service
        const quizzes = await quizService.getQuizzes();

        // render list of quizzes
        res.render('quizzes/index', {
            quizzes: quizzes
        })
    } catch(err) {
        console.error(err)
    }
});

// get create quiz page
router.get('/create', (req, res) => {
    try {
        // render create form for quiz
        res.render('quizzes/create');
    } catch(err) {
        console.error(err);
    }
});

// post new quiz
router.post('/create', async (req, res) => {
    try {
        // query service
        await quizService.createQuiz(req.body);

        // redirect page on successful post
        res.redirect('/quizzes');
    } catch(err) {
        console.error(err);
    }
})

// view individual quiz page
router.get('/:quizId', async (req, res) => {
    try {
        // get quiz id from url params
        const quizId = req.params.quizId;
        const quiz = await quizService.getSingleQuiz(quizId);
        const questions = await questionService.getAllQuestions(quizId);

        // if questions array is empty show error page
        if (questions.length <= 0) {
            res.render('error', {
                message: 'Cannot get questions for this quiz.'
            });
        }
        res.render('quizzes/view', {
            title: quiz[0].quiz_title,
            date: quiz[0].date_created,
            quizId: quizId,
            // isPlayer: req.user.role === 'player',
            // isViewer: req.user.role === 'viewer' || req.user.role === 'editor',
            // isEditor: req.user.role === 'editor',
            questions: questions
        })
    } catch(err) {
        console.error(err);
    }
})

// add new question to quiz
router.post('/:quizId/add', async (req, res) => {
    const quizId = req.params.quizId;
    const newQuestion = req.body;
    await quizService.addQuestion(quizId, newQuestion);
    console.log("new question added")
    // res.redirect('/quizzes');

    res.redirect(`/quizzes/${quizId}`);
})

// delete quiz
router.post('/:quizId/delete', async (req, res) => {
    try {
        const quizId = req.params.quizId;
        await quizService.deleteQuiz(quizId);
    } catch(err) {
        console.error(err);
    }
    res.redirect('/quizzes');

})

// export router
module.exports = router;