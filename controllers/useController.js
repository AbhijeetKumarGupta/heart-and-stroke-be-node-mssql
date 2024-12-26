const sql = require('mssql');

async function createSurvey(req, res) {
  const { user_info, answers } = req.body;
  const { email, first_name, last_name, phone_number, province } = user_info;

  let transaction;
  try {
    transaction = new sql.Transaction();
    await transaction.begin();

    // Step 1: Check if user already exists (by email)
    const existingUserResult = await transaction.request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT id FROM Survey.users WHERE email = @email;
      `);

    let userId;
    if (existingUserResult?.recordset?.length > 0) {
      userId = existingUserResult?.recordset?.[0]?.id;
    } else {
      const result = await transaction.request()
        .input('email', sql.NVarChar, email)
        .input('first_name', sql.NVarChar, first_name)
        .input('last_name', sql.NVarChar, last_name)
        .input('phone_number', sql.NVarChar, phone_number)
        .input('province', sql.NVarChar, province)
        .query(`
          INSERT INTO Survey.users (email, first_name, last_name, phone_number, province)
          VALUES (@email, @first_name, @last_name, @phone_number, @province);
          SELECT SCOPE_IDENTITY() AS user_id;
        `);

      userId = result?.recordset?.[0]?.user_id;
    }

    // Step 2: Create a unique submission record
    const submissionResult = await transaction.request()
      .input('user_id', sql.Int, userId)
      .query(`
        INSERT INTO Survey.submissions (user_id)
        VALUES (@user_id);
        SELECT SCOPE_IDENTITY() AS submission_id;
      `);

    const submissionId = submissionResult?.recordset?.[0]?.submission_id;

    // Step 3: Process the answers object, insert missing questions and options
    for (let questionName in answers) {
      let questionId = await checkOrInsertQuestion(transaction, questionName);

      for (let optionName in answers[questionName]) {
        const points = answers?.[questionName]?.[optionName];

        const optionId = await checkOrInsertOption(transaction, questionId, optionName, points);

        // Step 4: Insert the response for the question and submission
        await transaction.request()
          .input('submission_id', sql.Int, submissionId)
          .input('question_id', sql.Int, questionId)
          .input('option_id', sql.Int, optionId)
          .query(`
            INSERT INTO Survey.user_responses (submission_id, question_id, option_id)
            VALUES (@submission_id, @question_id, @option_id);
          `);
      }
    }

    // Step 5: Commit the transaction if everything is successful
    await transaction.commit();

    res.status(201).json({ message: 'Survey responses saved successfully', submissionId });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    console.error('Error creating survey:', error);
    res.status(500).json({
      message: 'Error creating survey',
      error: error.message,
    });
  }
}

module.exports = { createSurvey };
