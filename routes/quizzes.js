// get router
const express = require('express');
const router = express.Router();

// get quiz service
const quizService = require('../services/quizService')

// get question service
const questionService = require('../services/questionService');

// handling for authentication
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

// permissions
const { editorAccess } = require('../security/permissions');

// get quizzes page
router.get(
    '/',
    auth,
    async (req, res) => {
        try {
            // query service
            const quizzes = await quizService.getQuizzes();

            // if can't find quizzes show error page
            if (!quizzes) {
                res.render('error', {
                    message: 'No quizzes available.'
                });
            }
            // render list of quizzes
            res.render('quizzes/index', {
                quizzes: quizzes,
                isEdit: req.user.role === 'edit'
            })
        } catch(err) {
            console.error(err)
        }
    }
);

// delete quiz
router.post(
    '/:quizId/delete',
    auth,
    editorAccess,
    async (req, res) => {
        try {
            // get quiz id from url params
            const quizId = req.params.quizId;

            // query service
            await quizService.deleteQuiz(quizId);
        } catch(err) {
            console.error(err);
        }
        res.redirect('/quizzes');
    }
)

// get create quiz page
router.get(
    '/create',
    auth,
    editorAccess,
    (req, res) => {
        try {
            // render create form for quiz
            res.render('quizzes/create');
        } catch(err) {
            console.error(err);
        }
    }
);

// post new quiz
router.post(
    '/create',
    auth,
    editorAccess,
    async (req, res) => {
        try {
            // query service
            await quizService.createQuiz(req.body);

            // redirect page on successful post
            res.redirect('/quizzes');
        } catch(err) {
            console.error(err);
        }
    }
)

// view individual quiz page
router.get(
    '/:quizId',
    auth,
    async (req, res) => {
        try {
            // get quiz id from url params
            const quizId = req.params.quizId;

            // query service
            const quiz = await quizService.getSingleQuiz(quizId);
            let questions = await questionService.getAllQuestions(quizId);

            // add in array to determine how many quesitons there are and so
            // how many numbers the user can choose form when re ordering
            const orderArr = [1];
            for (let i = 0; i < questions.length; i++) {
                orderArr.push(i + 2);
            }

            // if questions array is empty show error page
            if (!questions) {
                res.render('error', {
                    message: 'No questions available for this quiz.'
                });
            }

            // otherwise render view quiz page
            res.render('quizzes/view', {
                title: quiz[0].quiz_title,
                date: quiz[0].date_created,
                quizId: quizId,
                isView: req.user.role === 'view' || req.user.role === 'edit',
                isEdit: req.user.role === 'edit',
                questions: questions,
                order_no: orderArr
            })
        } catch(err) {
            console.error(err);
        
        }
    }
)

// add new question to quiz
router.post(
    '/:quizId/add',
    auth,
    editorAccess,
    async (req, res) => {
        try {
            // get variables from request
            const quizId = req.params.quizId;
            const newQuestion = req.body;

            // query service
            await quizService.addQuestion(quizId, newQuestion);
            res.redirect(`/quizzes/${quizId}`);
        } catch(err) {
            console.error(err);
        }
    }
)

// export router
module.exports = router;