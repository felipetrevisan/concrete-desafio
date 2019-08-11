const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// eslint-disable-next-line func-names
module.exports = async (
  request,
  response,
  next,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: 'Token não informado.',
    });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.SECRET,
    );

    request.headers.userId = decoded.id;
    request.headers.token = token;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        code: 'token_expired',
        message: 'Token expirado',
      });
    }

    return response.status(401).json({
      code: 'unauthorized',
      message: 'Não autorizado',
    });
  }
};
