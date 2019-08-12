/* eslint-disable class-methods-use-this */
const mongoose = require('mongoose');
const moment = require('moment');
const session = require('../config/session');
const User = require('../models/User');

class UserController {
  async profile(
    request,
    response,
  ) {
    const { userId } = request.params;
    const { token } = request.headers;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response.status(500).json({
        code: 'bad_request',
        message: 'O id não está em um formato válido.',
      });
    }

    let user = await User.findById(userId);

    if (!user) {
      return response.status(404).json({
        code: 'user_not_found',
        message: 'Usuário não encontrado',
      });
    }

    if (user.token !== token) {
      return response.status(401).json({
        message: 'Não autorizado',
      });
    }

    // eslint-disable-next-line new-cap
    const lastLogin = new moment(user.lastLogin);
    // eslint-disable-next-line new-cap
    const duration = moment.duration(new moment().diff(lastLogin));

    if (duration.humanize().startsWith(session.duration)) {
      return response.status(401).json({
        message: 'Sessão inválida',
      });
    }

    user = user.toJSON();
    delete user.password;
    delete user.token;

    return response.json({
      user,
    });
  }
}

module.exports = new UserController();
