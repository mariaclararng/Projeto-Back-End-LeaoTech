const express = require('express');
const { register, login } = require('../controllers/authController');
const { addToCart, getCart } = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware'); // O nosso porteiro

const router = express.Router();

// ROTA DE REGISTRO 
router.post('/register', register);
router.post('/login', login);

router.post('/cart', authMiddleware, addToCart); // Quando o produto é adcionado no carrinho
router.get('/cart', authMiddleware, getCart);    // Olhar o carrinho

module.exports = router;