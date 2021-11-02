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
        console.log("answers", answers);

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