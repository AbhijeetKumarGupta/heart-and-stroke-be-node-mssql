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

const getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await surveyService.getUserSubmissions(userId);
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching survey data',
      error: error.message,
    });
  }
};

const getSubmission = async (req, res) => {
  try {
    const submissionId = parseInt(req.params.submissionId, 10);
    if (!submissionId) {
      return res.status(400).json({ message: 'Submission ID is required' });
    }
    const surveyData = await surveyService.getSubmission(submissionId);
    const transformedData = transformSurveyData(surveyData);
    res.status(200).json(transformedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching survey data',
      error: error.message,
    });
  }
};

const transformSurveyData = (data) => {
  if (!data || data.length === 0) {
    return {};
  }

  const userInfo = {
    email: data[0]?.email,
    first_name: data[0]?.first_name,
    last_name: data[0]?.last_name,
    phone_number: data[0]?.phone_number,
    province: data[0]?.province,
  };

  const answers = data.reduce((acc, row) => {
    const question = row?.question_name;
    const option = row?.option_name;
    const points = row?.points;

    if (!acc[question]) {
      acc[question] = {};
    }
    acc[question][option] = points;

    return acc;
  }, {});

  return {
    user_info: userInfo,
    answers: answers,
  };
};

module.exports = { createSurvey, getUserSubmissions, getSubmission };
