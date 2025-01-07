const { sql } = require('../config/database');

const createSubmission = async (userId) => {
  const req = new sql.Request();

  req.input('user_id', sql.Int, userId);

  const result = await req.query(`
    INSERT INTO Survey.submissions (user_id)
    VALUES (@user_id);
    SELECT SCOPE_IDENTITY() AS submission_id;
  `);

  return result?.recordset?.[0]?.submission_id;
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

const getUserSubmission = async (userId, submissionId) => {
  const request = new sql.Request();

  request.input('userId', sql.Int, userId);
  request.input('submissionId', sql.Int, submissionId);

  const result = await request.query(`
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
      s.id = @submissionId AND u.id = @userId;
  `);

  return result?.recordset || [];
};

module.exports = { createSubmission, getUserSubmissions, getUserSubmission };
