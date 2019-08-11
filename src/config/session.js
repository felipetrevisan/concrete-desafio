/* eslint-disable radix */
module.exports = {
  expiresIn: parseInt(process.env.TOKEN_EXPIRES) || 60 * 60,
  sessionDuration: parseInt(process.env.SESSION_DURATION) || 30,
};
