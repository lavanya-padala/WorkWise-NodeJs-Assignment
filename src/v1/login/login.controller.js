const loginService = require('./login.services');
const messages = require('../../config/messages.json');

exports.login = async (req, res) => {
  try {
    const { email_address, password } = req.body;

    // Authenticate the user using the login service
    const result = await loginService.authenticateUser(email_address, password);

    // If authentication is successful, return a success response along with the auth token
    res.status(200).json({ success: true, message: messages.loginSuccess, authToken: result.token });
  } 
  catch (error) {
    // If the error object has an `error` property, return it as a 400 Bad Request response
    if (error.error) {
      return res.status(400).json(error.error);
    }

    // If it's an internal server error, return a 500 Internal Server Error response
    res.status(500).json(messages.internalError);
  }
};
