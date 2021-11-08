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
    auth,
    editorAccess,
    async (req, res) => {
        try {
            // define variables
            const answers = req.body;
            const questionId = req.params.questionId;

            // query database and redirect
            await questionService.updateAnswers(answers, questionId);
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