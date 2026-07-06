// Criamos um carrinho na memória para simular o banco de dados de forma simples
let carrinhoMemoria = {};

// 1. ADICIONAR ITEM AO CARRINHO
const addToCart = async (req, res) => {
  try {
    const { item, quantidade } = req.body;
    const emailUsuario = req.userEmail; // Pego o e-mail que o porteiro (middleware) validou

    // Se o usuário ainda não tem um carrinho criado na memória, criamos um vazio
    if (!carrinhoMemoria[emailUsuario]) {
      carrinhoMemoria[emailUsuario] = [];
    }

    // Adiciona o item na lista do usuário
    carrinhoMemoria[emailUsuario].push({ item, quantidade });

    return res.status(200).json({ 
      message: 'Item adicionado ao carrinho com sucesso!', 
      carrinho: carrinhoMemoria[emailUsuario] 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao adicionar item ao carrinho.' });
  }
};

// 2. VER O CARRINHO
const getCart = async (req, res) => {
  try {
    const emailUsuario = req.userEmail; // Pego o e-mail que o porteiro validou

    // Busca os itens daquele usuário específico
    const meusItens = carrinhoMemoria[emailUsuario] || [];

    return res.status(200).json({ carrinho: meusItens });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar o carrinho.' });
  }
};

module.exports = { addToCart, getCart };