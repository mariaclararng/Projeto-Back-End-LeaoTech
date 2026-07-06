const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CADASTRO BÁSICO
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Salva o usuário diretamente no banco
    const newUser = await prisma.user.create({
      data: { name, email, password }
    });

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: newUser.id });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
};

// LOGIN BÁSICO
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo e-mail
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'E-mail ou senha incorretos.' });
    }

    return res.status(200).json({ message: 'Login realizado com sucesso!', user });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao realizar login.' });
  }
};

module.exports = { register, login };