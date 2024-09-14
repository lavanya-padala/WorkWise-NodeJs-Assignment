const pool = require('../../services/database/postgresql'); // PostgreSQL connection
const bcrypt = require('bcrypt');

// Find user by email or contact number
exports.findUserByEmailOrContact = (email_address, contact_number) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user_registration_details WHERE email_address = $1 OR contact_number = $2';
    pool.query(query, [email_address, contact_number], (error, results) => {
      if (error) {
        return reject(error);
      }
  
      resolve(results.rows[0]); // Use rows to get result in PostgreSQL
    });
  });
};

// Create a new user
exports.createUser = (email, contactnumber, password,role) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 7);
      const query = `
        INSERT INTO user_registration_details (email_address, contact_number, password, created_at, updated_at,role)
        VALUES ($1, $2, $3, NOW(), NOW(),$4)
        RETURNING id
      `;
      pool.query(query, [email, contactnumber, hashedPassword,role], (error, results) => {
        if (error) {
          if (error.code === '23505') { // PostgreSQL duplicate entry error code
            return reject('Duplicate entry');
          }
          return reject(error);
        }
        resolve({ id: results.rows[0].id, email, contactnumber });
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Soft delete user
exports.softDeleteUser = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE user_registration_details
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `;
    pool.query(query, [userId], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results.rowCount > 0); // Use rowCount to check affected rows in PostgreSQL
    });
  });
};
