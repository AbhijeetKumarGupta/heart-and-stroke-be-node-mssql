const { sql } = require('../config/database');

const checkOrInsertOption = async (questionId, optionName, points) => {
  const req = new sql.Request();
  
  req.input('question_id', sql.Int, questionId);
  req.input('option_name', sql.NVarChar, optionName);
  req.input('points', sql.Int, points);

  let result = await req.query(`
    SELECT id FROM Survey.options WHERE question_id = @question_id AND option_name = @option_name;
  `);

  if (result?.recordset?.length === 0) {
    const insertResult = await req.query(`
      INSERT INTO Survey.options (question_id, option_name, points)
      VALUES (@question_id, @option_name, @points);
      SELECT SCOPE_IDENTITY() AS option_id;
    `);
    return insertResult?.recordset?.[0]?.option_id;
  }

  return result?.recordset?.[0]?.id;
};

module.exports = { checkOrInsertOption };
