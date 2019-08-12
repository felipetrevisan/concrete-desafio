/* eslint-disable class-methods-use-this */
const { expiresIn } = require('../config/session');
const User = require('../models/User');

class AuthController {
  async authenticate(
    request,
    response,
  ) {
    const { email, password } = request.body;

    let user = await User.findOne({ email });

    if (!user) {
      return response.status(401).json({
        message: 'Usuário e/ou senha inválidos',
      });
    }

    if (!(await user.checkPassword(password))) {
      return response.status(401).json({
        message: 'Usuário e/ou senha inválidos',
      });
    }

    user.token = user.generateToken();
    user.lastLogin = new Date();
    user.save();

    const { token } = user;

    user = user.toJSON();
    delete user.password;
    delete user.token;

    return response.json({
      user,
      token,
      expiresIn,
    });
  }
}

module.exports = new AuthController();
