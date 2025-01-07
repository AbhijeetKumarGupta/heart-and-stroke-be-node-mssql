const submissionService = require('../services/submissionService');

const createSubmission = async (req, res) => {
  try {
    const result = await submissionService.createSubmission(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Error submitting survey',
      error: error.message,
    });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await submissionService.getUserSubmissions(userId);
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching submission data',
      error: error.message,
    });
  }
};

const getUserSubmission = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const submissionId = parseInt(req.params.submissionId, 10);
    if (!submissionId || !userId) {
      return res.status(400).json({ message: 'Submission and User ID is required' });
    }
    const surveyData = await submissionService.getUserSubmission(userId, submissionId);
    res.status(200).json(surveyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching submission data',
      error: error.message,
    });
  }
};

module.exports = { createSubmission, getUserSubmissions, getUserSubmission };
