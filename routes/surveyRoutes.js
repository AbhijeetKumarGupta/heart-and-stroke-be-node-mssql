const express = require('express');
const surveyController = require('../controllers/surveyController');

const router = express.Router();

router.post('/survey', surveyController.createSurvey);

module.exports = router;