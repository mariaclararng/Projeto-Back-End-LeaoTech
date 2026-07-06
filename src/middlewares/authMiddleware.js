// O PORTEIRO DO SISTEMA
const authMiddleware = (req, res, next) => {
  // Pegamos o e-mail de quem está fazendo a requisição
  const userEmail = req.headers['user-email'];

  // Se não foi enviado nenhum e-mail, barra o acesso
  if (!userEmail) {
    return res.status(401).json({ error: 'Acesso negado. Você precisa informar seu e-mail para acessar o carrinho.' });
  }

  // Se o e-mail existe, salvamos ele na requisição para o carrinho usar
  req.userEmail = userEmail;
  
  // "Next" diz para o Express: pode deixar a pessoa passar para a rota!
  next();
};

module.exports = authMiddleware;