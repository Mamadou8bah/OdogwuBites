const {getCartByUserId,addToCart,removeFromCart,clearCart}=require('../controller/cart');
const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middleware/authMiddleware')

router.get('/me',isLoggedIn,getCartByUserId);
router.get('/:userId',isLoggedIn,getCartByUserId);
router.post('/add/:id',isLoggedIn,addToCart);
router.post('/remove/:id',isLoggedIn,removeFromCart);
router.post('/clear',isLoggedIn,clearCart);

module.exports=router;

