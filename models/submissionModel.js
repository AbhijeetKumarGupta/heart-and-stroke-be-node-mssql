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

module.exports = { createSubmission };
