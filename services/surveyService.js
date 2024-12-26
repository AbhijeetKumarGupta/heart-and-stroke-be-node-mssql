const userModel = require('../models/userModel');
const questionModel = require('../models/questionModel');
const optionModel = require('../models/optionModel');
const submissionModel = require('../models/submissionModel');
const userResponseModel = require('../models/userResponseModel');

const createSurvey = async (data) => {
  const { user_info, answers } = data;
  const { email } = user_info;

  // Step 1: Check if user exists or create new user
  let user = await userModel.getUserByEmail(email);
  if (!user) {
    user = await userModel.createUser(user_info);
  }

  // Step 2: Create a submission record
  const submissionId = await submissionModel.createSubmission(user?.user_id || user?.id);

  // Step 3: Insert questions, options, and responses
  for (const questionName in answers) {
    const questionId = await questionModel.checkOrInsertQuestion(questionName);

    for (const optionName in answers[questionName]) {
      const points = answers[questionName][optionName];
      const optionId = await optionModel.checkOrInsertOption(questionId, optionName, points);

      await userResponseModel.createResponse(submissionId, questionId, optionId);
    }
  }

  return { message: 'Survey responses saved successfully', submissionId };
};

module.exports = { createSurvey };