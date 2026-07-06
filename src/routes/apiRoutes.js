const express = require('express');
const { register, login } = require('../controllers/authController');
const { addToCart, getCart } = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware'); // O nosso porteiro

const router = express.Router();

// Rotas públicas (qualquer um acessa)
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas (precisam passar pelo porteiro antes de chegar ao controller)
router.post('/cart', authMiddleware, addToCart); // Adicionar ao carrinho
router.get('/cart', authMiddleware, getCart);    // Ver o carrinho

module.exports = router;