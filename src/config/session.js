module.exports = {
  // eslint-disable-next-line radix
  expiresIn: parseInt(process.env.SESSION_EXPIRES) || 60 * 60,
};
