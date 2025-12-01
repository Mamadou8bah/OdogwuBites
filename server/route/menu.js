const {createMenuItem,deleteMenuItem,getAllMenuItems,getMenuItemById,getMenuItemByCategory,updateMenuItem,searchMenuItems}=require('../controller/menuItems')
const {isLoggedIn,isAdmin}=require('../middleware/authenticationMiddleware')
const express=require('express')
const multer=require('multer')
const router=express.Router();

const upload=multer();
router.post('/create',upload.single('image'),isLoggedIn,isAdmin,createMenuItem);
router.delete('/delete/:id',isLoggedIn,isAdmin,deleteMenuItem);
router.get('/all',getAllMenuItems);
router.get('/category/:categoryId',getMenuItemByCategory);
router.get('/:id',getMenuItemById);
router.put('/update/:id',upload.single('image'),isLoggedIn,isAdmin,updateMenuItem);
router.get('/search',searchMenuItems);

module.exports=router;