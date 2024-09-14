const signupService = require('./signup.services');
const messages = require('../../config/messages.json');

exports.signup = async (req, res) => {
  try {
    const { email_address, contact_number, password, role } = req.body;

    // Check if a user already exists with the same email or contact number
    const existingUser = await signupService.findUserByEmailOrContact(email_address, contact_number);
    
    // If a user with the same email exists, return an error
    if (existingUser) {
      if (existingUser?.email_address == email_address) {
        return res.status(400).json(messages.emailAlreadyExists);  
      }
      // If a user with the same contact number exists, return an error
      if (existingUser?.contact_number == contact_number) {
        return res.status(400).json(messages.mobileAlreadyExists);  
      }
      return res.status(400).json(messages.userAlreadyExists);  
    }

    // Create a new user if no conflicts were found
    const user = await signupService.createUser(email_address, contact_number, password, role);      

    // If user creation is successful, return success message
    if (user?.id) {
      res.status(201).json(messages.signupSuccess);
    }
  } catch (error) {
    // Catch any internal server errors
    res.status(500).json(messages.internalError);
  }
};
