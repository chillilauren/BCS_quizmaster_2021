// get router
const express = require('express');
const router = express.Router();

// get questions functions
const questionService = require('../services/questionService');

// view individual question page
router.get('/:questionId', async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const question = await questionService.getQuestion(questionId);
        const answers = await questionService.getAnswers(questionId);

        // if answers array is empty show error page
        if (answers.length <= 0) {
            res.render('error', {
                message: 'Cannot get answers for this quiz.'
            });
        }
        res.render('questions/index', {
            question: question[0].question,
            answers: answers[0],
            quizId: question[0].quiz_id
        });
    } catch(err) {
        console.error(err);
    }
})

// edit individual question
router.get('/:questionId/edit', async (req, res) => {
    const questionId = req.params.questionId;
    const question = await questionService.getQuestion(questionId);
    const answers = await questionService.getAnswers(questionId);

    res.render('questions/edit', {
        question: question[0].question,
        questionId: questionId,
        answers: answers[0],
        quizId: question[0].quiz_id
    });
})

router.post('/:questionId/edit', async (req, res) => {
    const answers = req.body;
    const questionId = req.params.questionId;
    await questionService.updateAnswers(answers, questionId);

    res.redirect(`/questions/${questionId}`)
})

// add new question to quiz

// export router
module.exports = router;