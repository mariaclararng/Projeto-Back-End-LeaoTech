// ITEM AO CARRINHO DE COMPRA 
const addToCart = async (req, res) => {
  try {
    const { item, quantidade } = req.body;
    const emailUsuario = req.userEmail; 
    if (!carrinhoMemoria[emailUsuario]) {
      carrinhoMemoria[emailUsuario] = [];
    }

    // QUANDO ITEM É ADCIONADO 
    carrinhoMemoria[emailUsuario].push({ item, quantidade });

    return res.status(200).json({ 
      message: 'Item adicionado ao carrinho com sucesso!', 
      carrinho: carrinhoMemoria[emailUsuario] 
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao adicionar item ao carrinho.' });
  }
};

// 2. CARRINHO
const getCart = async (req, res) => {
  try {
    const emailUsuario = req.userEmail; // Pego o e-mail que o usuario validou

    // Busca os itens daquele usuário específico
    const meusItens = carrinhoMemoria[emailUsuario] || [];

    return res.status(200).json({ carrinho: meusItens });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar o carrinho.' });
  }
};

module.exports = { addToCart, getCart };