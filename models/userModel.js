const { sql } = require('../config/database');

const getUserByEmail = async (email) => {
  const request = new sql.Request();

  request.input('email', sql.NVarChar, email);

  const result = await request.query(`
      SELECT id FROM Survey.users WHERE email = @email;
    `);

  return result?.recordset?.[0] || null;
};

const createUser = async (user_info) => {
  const { email, first_name, last_name, phone_number, province } = user_info;

  const request = new sql.Request();

  request.input('email', sql.NVarChar, email);
  request.input('first_name', sql.NVarChar, first_name);
  request.input('last_name', sql.NVarChar, last_name);
  request.input('phone_number', sql.NVarChar, phone_number);
  request.input('province', sql.NVarChar, province);

  const result = await request.query(`
    INSERT INTO Survey.users (email, first_name, last_name, phone_number, province)
    VALUES (@email, @first_name, @last_name, @phone_number, @province);
    SELECT SCOPE_IDENTITY() AS user_id;
  `);

  return result?.recordset?.[0];
};

module.exports = { getUserByEmail, createUser };

