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

// export router
module.exports = router;