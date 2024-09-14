const pool = require("../../services/database/postgresql"); 
const bcrypt = require("bcrypt");
const redisClient = require("../../services/database/redis");
const messages = require("../../config/messages.json");
const { generateToken } = require("../utils/jwt");

exports.authenticateUser = (email_address, password) => {
  return new Promise((resolve, reject) => {
    // query to get the user from PostgreSQL
    pool.query(
      "SELECT * FROM user_registration_details WHERE email_address = $1",
      [email_address],
      (error, results) => {
        if (error) {
          return reject({ error: messages.internalError });
        }
        if (results.rows.length === 0) {
          return reject({ error: messages.userNotFound });
        }
        const user = results.rows[0];

        // compare the provided password with the hashed password
        bcrypt.compare(password, user.password, (err, passwordMatch) => {
          if (err) {
            return reject({ error: messages.internalError });
          }

          if (!passwordMatch) {
            return reject({ error: messages.invalidCredentials });
          }

          // Generate JWT token
          const token = generateToken({
            id: user.id
          });

          // Store token in Redis
          redisClient.setex(
            `session:${user.id}`,
            7 * 24 * 60 * 60, // 1 week expiration
            token,
            (redisError) => {
              if (redisError) {
                return reject({ error: messages.internalError });
              }
              resolve({ token, user });
            }
          );
        });
      }
    );
  });
};
