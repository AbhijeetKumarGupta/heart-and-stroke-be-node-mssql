const { sql } = require('../config/database');
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

const getUserSubmissions = async (userId) => {
  const request = new sql.Request();

  request.input('userId', sql.Int, userId);

  const result = await request.query(`
    SELECT 
      s.id AS submission_id,
      s.submission_date
    FROM 
      Survey.submissions s
    WHERE 
      s.user_id = @userId;
  `);
  
  return result?.recordset || [];
};


const getSubmission = async (submissionId) => {
  const request = new sql.Request();

  request.input('submissionId', sql.Int, submissionId);

  const query = `
    SELECT 
      u.id AS user_id,
      u.email,
      u.first_name,
      u.last_name,
      u.phone_number,
      u.province,
      q.question_name,
      o.option_name,
      o.points
    FROM 
      Survey.users u
    JOIN 
      Survey.submissions s ON u.id = s.user_id
    JOIN 
      Survey.user_responses ur ON s.id = ur.submission_id
    JOIN 
      Survey.questions q ON ur.question_id = q.id
    JOIN 
      Survey.options o ON ur.option_id = o.id
    WHERE 
      s.id = @submissionId;
  `;

  const result = await request.query(query);

  return result?.recordset || [];
};

module.exports = { createSurvey, getUserSubmissions, getSubmission };