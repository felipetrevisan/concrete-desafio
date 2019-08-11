/* eslint-disable class-methods-use-this */
const User = require('../models/User');

class SignupController {
  async store(
    request,
    response,
    next,
  ) {
    const {
      name, email, password, phones,
    } = request.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return response.status(400).json({
        code: 'bad_request',
        message: 'E-mail ja existente.',
      });
    }

    try {
      let user = await User.create({
        name,
        email,
        password,
        phones,
      });

      const { token } = user;

      user = user.toJSON();
      delete user.password;
      delete user.token;

      return response.status(201).json({
        ...user,
        token,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new SignupController();
