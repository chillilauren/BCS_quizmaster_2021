// get router
const express = require('express');
const router = express.Router();

// get questions functions
const questionService = require('../services/questionService');

// view individual question page
router.get('/:questionId', async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const answers = await questionService.getQuestionData(questionId);

        // if answers array is empty show error page
        if (answers.length <= 0) {
            res.render('error', {
                message: 'Cannot get answers for this quiz.'
            });
        }
        res.render('questions/index', {
            question: answers[0].question,
            answers: answers[0]
        });
    } catch(err) {
        console.error(err);
    }
})

// edit individual question
router.get('/:questionId/edit', async (req, res) => {
    const questionId = req.params.questionId;
    const questionData = await questionService.getQuestionData(questionId);
    
    res.render('questions/edit', {
        question: questionData[0].question,
        answers: questionData[0]
    });
})

// export router
module.exports = router;