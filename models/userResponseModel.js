const { sql } = require('../config/database');

const createResponse = async (submissionId, questionId, optionId) => {
  const req = new sql.Request();

  req.input('submission_id', sql.Int, submissionId);
  req.input('question_id', sql.Int, questionId);
  req.input('option_id', sql.Int, optionId);

  const result = await req.query(`
    INSERT INTO Survey.user_responses (submission_id, question_id, option_id)
    VALUES (@submission_id, @question_id, @option_id);
  `);

  return result;
};

module.exports = { createResponse };