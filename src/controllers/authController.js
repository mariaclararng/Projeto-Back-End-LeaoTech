const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// CADASTRO
const register = async (req, res) => {
  try {
    const {
      nome,
      cpf,
      email,
      password,
      celular,
      endereco,
      bairro,
      cidade,
      cep,
      complemento,
    } = req.body;

    // Verifica se já existe usuário
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({
        error: "E-mail já cadastrado.",
      });
    }

    // Criptografa a senha
    const hashPassword = await bcrypt.hash(password, 10);

    // Cadastra usuário
    const newUser = await prisma.user.create({
      data: {
        nome,
        cpf,
        email,
        password: hashPassword,
        celular,
        endereco,
        bairro,
        cidade,
        cep,
        complemento,
      },
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      userId: newUser.id,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao cadastrar usuário.",
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Procura usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        error: "E-mail ou senha incorretos.",
      });
    }

    // Compara senha
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        error: "E-mail ou senha incorretos.",
      });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        cpf: user.cpf,
        celular: user.celular,
        endereco: user.endereco,
        bairro: user.bairro,
        cidade: user.cidade,
        cep: user.cep,
        complemento: user.complemento,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao realizar login.",
    });
  }
};

module.exports = {
  register,
  login,
};
