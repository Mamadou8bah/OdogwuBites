const express=require('express')
const {register,login,verify,requestPasswordReset,resetPassword,becomeAdmin,becomeStaff,fireStaff}=require('../controller/authentication')

const router=express.Router();

router.post('/register',register);

router.post('/login',login);

router.get('/verify-email',verify)
router.post('/request-password-reset',requestPasswordReset);
router.post('/reset-password',resetPassword);
router.post('/become-admin',becomeAdmin);
router.post('/become-staff',becomeStaff);
router.post('/fire-staff',fireStaff);

module.exports=router;
