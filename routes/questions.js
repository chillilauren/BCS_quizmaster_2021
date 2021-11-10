// get router
const express = require('express');
const router = express.Router();

// get questions functions
const questionService = require('../services/questionService');

// handling for authentication
const passport = require('passport');
const auth = passport.authenticate('jwt', { session: false });

// permissions
const { viewerAccess, editorAccess } = require('../security/permissions');

// server-side validation
const { body, validationResult } = require('express-validator');

// view individual question page
router.get(
    '/:questionId',
    auth,
    viewerAccess,
    async (req, res) => {
        try {
            // define variables and query database
            const questionId = req.params.questionId;
            const question = await questionService.getQuestion(questionId);
            const answers = await questionService.getAnswers(questionId);

            // if answers array is empty show error page
            if (answers.length <= 0) {
                res.render('error', {
                    message: 'Cannot get answers for this quiz.'
                });
            }
            // render list of quizzes page with variables
            res.render('questions/index', {
                question: question[0].question,
                answers: answers[0],
                quizId: question[0].quiz_id
            });
        } catch(err) {
            console.error(err);
        }
    }
)

// edit individual question
router.get(
    '/:questionId/edit',
    auth,
    editorAccess,
    async (req, res) => {
        try {
            // define variables and query database
            const questionId = req.params.questionId;
            const question = await questionService.getQuestion(questionId);
            const answers = await questionService.getAnswers(questionId);
        
            // render edit questions page with variables
            res.render('questions/edit', {
                question: question[0].question,
                questionId: questionId,
                answers: answers[0],
                quizId: question[0].quiz_id
            });
        } catch(err) {
            console.error(err);
        }
    }
)

router.post(
    '/:questionId/edit',
    [
        body('edit-question')
        .not().isEmpty().withMessage('Question cannot be empty.')
        .isLength({ max: 100 }).withMessage('Question cannot be longer than 100 characters.'),
        body('opt_a').not().isEmpty().withMessage('Answer option cannot be empty.')
        .isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.'),
        body('opt_b').not().isEmpty().withMessage('Answer option cannot be empty.')
        .isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.'),
        body('opt_c').not().isEmpty().withMessage('Answer option cannot be empty.')
        .isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.'),
        body('opt_d').isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.'),
        body('opt_e').isLength({ max: 45 }).withMessage('Answer option cannot be longer than 45 characters.'),
        body('correct_answer')
        .not().isEmpty().withMessage('Correct answer cannot be empty.')
        .isLength({ max: 1 }).withMessage('Correct answer cannot be longer than 1 character.')
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

            // define variables
            const answers = req.body;
            const questionId = req.params.questionId;

            console.log(answers)


            // query database and redirect
            await questionService.updateQuestion(answers, questionId);
            res.redirect(`/questions/${questionId}`)
        } catch(err) {
            console.error(err);
        }
    }
)

// delete individual question
router.post(
    '/:questionId/delete',
    auth,
    editorAccess,
    async (req, res) => {
        try {
            // define variables and query database
            const questionId = req.params.questionId;
            const question = await questionService.getQuestion(questionId);

            // query database and redirect
            await questionService.deleteQuestion(questionId);
            res.redirect(`/quizzes/${question[0].quiz_id}`)
        } catch(err) {
            console.error(err);
        }
    }
)

// export router
module.exports = router;