const jwt = require('jsonwebtoken');
const messages = require('../../config/messages.json');
require('dotenv').config();

const  JWT_SECRET  = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(messages.secretKeyMissing);
}

const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

module.exports = { generateToken, verifyToken };
