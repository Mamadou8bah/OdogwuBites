const {getCartByUserId,addItemToCart,removeItemFromCart,clearCart}=require('../controller/cart');
const express=require('express');
const router=express.Router();
const {isLoggedIn}=require('../middleware/authMiddleware')

router.get('/:userId',isLoggedIn,getCartByUserId);
router.post('/add/:id',isLoggedIn,addItemToCart);
router.post('/remove/:id',isLoggedIn,removeItemFromCart);
router.post('/clear',isLoggedIn,clearCart);

module.exports=router;

