const surveyService = require('../services/surveyService');

const createSurvey = async (req, res) => {
  try {
    const result = await surveyService.createSurvey(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error creating survey',
      error: error.message,
    });
  }
};

module.exports = { createSurvey };
