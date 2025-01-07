const userModel = require('../models/userModel');
const questionModel = require('../models/questionModel');
const optionModel = require('../models/optionModel');
const submissionModel = require('../models/submissionModel');
const userResponseModel = require('../models/userResponseModel');

const createSubmission = async (data) => {
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

const getUserSubmissions = async (userId) => {
  const userSubmissions = await submissionModel.getUserSubmissions(userId)
  return userSubmissions;

}

const getUserSubmission = async (userId, submissionId) => {
  const submissionData = await submissionModel.getUserSubmission(userId, submissionId);
  return transformSubmissionData(submissionData);
};


const transformSubmissionData = (data) => {
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

module.exports = { createSubmission, getUserSubmission, getUserSubmissions };