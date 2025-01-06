const express = require('express');
const surveyController = require('../controllers/surveyController');

const router = express.Router();

router.post('/survey', surveyController.createSurvey);
router.get('/survey/user/:userId', surveyController.getUserSubmissions);
router.get('/survey/submission/:submissionId', surveyController.getSubmission);

module.exports = router;