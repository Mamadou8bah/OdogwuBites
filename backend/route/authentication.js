const express=require('express')
const {register,login,verify,requestPasswordReset,resetPassword,becomeAdmin,becomeStaff,fireStaff,getProfile,updateProfile}=require('../controller/authentication')
const {isLoggedIn}=require('../middleware/authMiddleware')

const router=express.Router();

router.post('/register',register);

router.post('/login',login);

router.get('/profile',isLoggedIn,getProfile);
router.put('/profile',isLoggedIn,updateProfile);
router.get('/verify-email',verify)
router.post('/request-password-reset',requestPasswordReset);
router.post('/reset-password',resetPassword);
router.post('/become-admin',becomeAdmin);
router.post('/become-staff',becomeStaff);
router.post('/fire-staff',fireStaff);

module.exports=router;
