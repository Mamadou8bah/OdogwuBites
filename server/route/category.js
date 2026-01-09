const {getAllCategories,getCategoryById,createCategory,deleteCategory}=require('../controller/category');
const express=require('express');
const router=express.Router();
const {isLoggedIn,isAdmin}=require('../middleware/authMiddleware');

router.get('/',getAllCategories);
router.get('/:id',getCategoryById);
router.post('/',isLoggedIn,isAdmin,createCategory);
router.delete('/:id',isLoggedIn,isAdmin,deleteCategory);

module.exports=router;