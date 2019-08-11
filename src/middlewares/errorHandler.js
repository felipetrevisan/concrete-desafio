module.exports = (
  error,
  _request,
  response,
  _next,
) => {
  // handler for validation error like mongoose validation
  if (error.name === 'ValidationError') {
    const errors = [];

    Object.keys(error.errors).forEach((key) => {
      errors.push(error.errors[key].message);
    });

    return response.status(400).json({
      code: 'bad_request',
      error: 'Ops! Erro ao tentar processar a requisição.',
      message: errors,
    });
  }

  return response.status(500).json({
    code: 'server_error',
    error: 'Desculpe! Estamos com algum problema, por favor, se o problema persistir entre em contato através do e-mail felipejs@gmail.com',
  });
};
