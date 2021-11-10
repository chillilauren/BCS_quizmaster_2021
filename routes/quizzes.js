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

// server-side validation
const { body, validationResult } = require('express-validator');

// get quizzes page
router.get(
    '/',
    auth,
    async (req, res) => {
        try {
            // define variables and query database
            const quizzes = await quizService.getQuizzes();

            // if can't find quizzes show error page
            if (!quizzes) {
                res.render('error', {
                    message: 'No quizzes currently available.'
                });
            }
            // render list of quizzes page with variables
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

            // query database
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
    [
        body('title')
        .not().isEmpty().withMessage('Quiz title cannot be empty.')
        .isLength({ max: 100 }).withMessage('Quiz title cannot be longer than 100 characters.')
    ],
    auth,
    editorAccess,
    async (req, res) => {
        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // query database
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

            // query database
            const quiz = await quizService.getSingleQuiz(quizId);
            const questions = await questionService.getAllQuestions(quizId);

        // ####
        // ALSO SHOWS APPLICATION OF MATHS HERE, THIS PART WORKED AS I INTENDED BUT NOT WITH
        // THE REST OF THE CODE

        // BELOW WOULD BE FOR ADJUSTING ORDER OF QUESTIONS, COULDNT GET TO WORK IN TIME
            // const questionsArr = questions;

            // add in array to determine how many quesitons there are and so
            // how many numbers the user can choose form when re ordering
            // const orderArr = [1];
            // for (let i = 0; i < questions.length; i++) {
            //     orderArr.push(i + 2);
            // };

        // ####

            // if questions array is empty show error page
            if (!questions) {
                res.render('error', {
                    message: 'No questions available for this quiz.'
                });
            }
            // otherwise render view quiz page with variables
            res.render('quizzes/view', {
                title: quiz[0].quiz_title,
                date: quiz[0].date_created,
                quizId: quizId,
                isView: req.user.role === 'view' || req.user.role === 'edit',
                isEdit: req.user.role === 'edit',
                questions: questions,
                // order_no: questionsArr
            })
        } catch(err) {
            console.error(err);
        }
    }
)

// add new question to quiz
router.post(
    '/:quizId/add',
    [
        body('question')
        .not().isEmpty().withMessage('Question cannot be empty.')
        .isLength({ max: 100 }).withMessage('Question cannot be longer than 100 characters.'),
        body('opt_a').not().isEmpty().withMessage('Answer option cannot be empty.')
        .isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.'),
        body('opt_b').not().isEmpty().withMessage('Answer option cannot be empty.')
        .isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.'),
        body('opt_c').not().isEmpty().withMessage('Answer option cannot be empty.')
        .isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.'),
        body('opt_d').isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.'),
        body('opt_e').isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.')
    ],
    auth,
    editorAccess,
    async (req, res) => {
        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // get variables from request
            const quizId = req.params.quizId;
            const newQuestion = req.body;

            // query database
            await quizService.addQuestion(quizId, newQuestion);
            res.redirect(`/quizzes/${quizId}`);
        } catch(err) {
            console.error(err);
        }
    }
)

// export router
module.exports = router;