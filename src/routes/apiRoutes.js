const express = require('express');
const { register, login } = require('../controllers/authController');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware'); // O nosso porteiro

const router = express.Router();

// ROTA DE REGISTRO 
router.post('/register', register);
router.post('/login', login);

router.get('/cart/:userId', getCart);
router.post('/cart/add', addToCart);
router.put('/cart/item/:id', updateCartItem);
router.delete('/cart/item/:id', removeCartItem);
router.delete('/cart/clear/:userId', clearCart);
module.exports = router;