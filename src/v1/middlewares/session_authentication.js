const boom = require('@hapi/boom');
const redisClient = require('../../services/database/redis');
const { verifyToken } = require('../utils/jwt');
const messages=require("../../config/messages.json")

const authenticate = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw boom.unauthorized(messages.headerMissing);
    }
    
    const token = req.headers.authorization;
    
    if (!token) {
      throw boom.unauthorized(messages.tokenMissing);
    }
    const decoded = await verifyToken(token);

    const session = await redisClient.get(`session:${decoded.id}`);

    if (!session) {
      throw boom.unauthorized(messages.sessionError);
    }
    req.user_id = decoded.id;
    next();
  } catch (error) {
    next(error.isBoom ? error : boom.unauthorized(messages.tokenMissing));
  }
};

module.exports = authenticate;