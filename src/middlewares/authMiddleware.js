// ENTRADA DO SISTEMA
const authMiddleware = (req, res, next) => {
  const userEmail = req.headers['user-email'];

  if (!userEmail) {
    return res.status(401).json({ error: 'Acesso negado. Você precisa informar seu e-mail para acessar o carrinho.' });
  }
  req.userEmail = userEmail;
  
  next();
};

module.exports = authMiddleware;