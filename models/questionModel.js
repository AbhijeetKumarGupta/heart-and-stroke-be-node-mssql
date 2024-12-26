const { sql } = require('../config/database');

const checkOrInsertQuestion = async (questionName) => {
  const req = new sql.Request();
  
  req.input('question_name', sql.NVarChar, questionName);

  let result = await req.query(`
    SELECT id FROM Survey.questions WHERE question_name = @question_name;
  `);

  if (result?.recordset?.length === 0) {
    const insertResult = await req.query(`
      INSERT INTO Survey.questions (question_name)
      VALUES (@question_name);
      SELECT SCOPE_IDENTITY() AS question_id;
    `);
    return insertResult?.recordset?.[0]?.question_id;
  }

  return result?.recordset?.[0]?.id;
};

module.exports = { checkOrInsertQuestion };
