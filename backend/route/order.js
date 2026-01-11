const {createOrder, getOrderById, getOrdersByUserId, getMyAssignedOrders, cancelOrder, deliverOrder, getAllOrders, acceptOrder}=require('../controller/order');
const express=require('express');
const {isLoggedIn,isAdmin,isStaff}=require('../middleware/authMiddleware');
const router=express.Router();

router.post('/create',isLoggedIn,createOrder);
router.get('/user/:userId',isLoggedIn,getOrdersByUserId);
router.get('/assigned/me',isLoggedIn,isStaff,getMyAssignedOrders);
router.get('/:id',isLoggedIn,getOrderById);
router.post('/cancel/:id',isLoggedIn,cancelOrder);
router.post('/accept/:id',isLoggedIn,isAdmin,acceptOrder);
router.post('/deliver/:id',isLoggedIn,isStaff,deliverOrder);
router.get('/',isLoggedIn,isAdmin,getAllOrders);

module.exports=router;  