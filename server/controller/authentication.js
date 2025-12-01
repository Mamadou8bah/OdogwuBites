const User = require('../model/Users')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const {createToken,findTokenByToken}=require('../controller/verificationToken')
const {createResetToken,findResetTokenByToken}=require('../controller/resetToken')

const {sendEmailVerificationEmail,sendPasswordResetEmail}=require('../utils/emailSender')
const ResetToken = require('../model/ResetToken')

const signingKey = process.env.JWT_SECRET

const register = async (req, res) => {
  try {
    const existingEmail = req.body.email;

    const existingUser = await User.findOne({ email: existingEmail })
    if (existingUser) {
      return res.status(400).json('There is a user with this email, please login');
    }

    const userPassword = req.body.password;
    const saltNumber = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(userPassword, saltNumber);

    const newUser = new User(req.body);
    newUser.password = hashedPassword;
    newUser.role = 'customer';

    const verificationCode = createToken(newUser._id);
    await newUser.save();
    const link = `http://localhost:3000/auth/verify-email?code=${verificationCode}&email=${newUser.email}`;
    await sendEmailVerificationEmail(newUser.email,newUser.name,link)

    res.status(201).json({
      message: "User Registered Successfully, please verify your email",
      User: newUser
    });

  } catch (error) {
    res.status(400).json(error);
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json('Invalid Credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);


    if (!passwordMatches) {
      return res.status(400).json('Password Incorrect');
    }
    if(!user.verified){
        return res.status(400).json('Please verify your email');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      signingKey,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login Successful",
      token
    });

  } catch (error) {
    res.status(400).json(error);
  }
}

const verify= async (req,res)=>{
    try{
    const {email,code}=req.query;
    const user=await  User.findOne({email:email})


    if(!user){
        return res.status(400).json('Invalid link')
    }
    const Token=await findTokenByToken(code)
    if(Token){
        user.verified=true;
        user.verificationCode = null;
        await user.save()
        res.status(200).json('email verified please login')
    }else{
        return res.status(400).json('Invalid link')
    }
    }catch(error){
        res.status(400).json(error);
    }
}

const requestPasswordReset=async(req,res)=>{
  try{
    const email=req.body.email;
    const user= await User.findOne({
      email:email
    })
    if(!user){
      return res.status(400).json('No User with this email')
    }
    const Token=await createResetToken(user._id);
    const link = `http://localhost:3000/auth/reset-password?token=${Token}&email=${user.email}`;
    await sendPasswordResetEmail(user.email,user.name,link)

    res.status(200).json('Chech your email')
  }catch(error){
    res.status(400).json(error);
  }
}

const resetPassword= async(req,res)=>{
  try{
    const {email,token}=req.query;
    const newPassword=req.body.newPassword;
    const user= await User.findOne({
      email:email
    })
    if(!user){
      return res.status(400).json('No user with this email')
    }
    const Token=await findResetTokenByToken(token);
    if(!Token){
      return res.status(400).json('Invalid Token')
    }
    if(Token.userId.toString() !== user._id.toString()) {
      return res.status(400).json('Invalid token for this user');
    }
    const hashedPassword=await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;
    await user.save()
    res.status(200).json('Password succesfully updated')
  }catch(error){
    res.status(400).json(error)
  }
}
const becomeAdmin=async(req,res)=>{
  try{
    const email=req.body.email;
    const user=await User.findOne({
      email:email
    })
    if(!user){
      return res.status(400).json('No user with such email')
    }
    user.role='admin'
    await user.save()
    res.status(200).json(`${user.name} is now an Admin`)
  }catch(error){
    res.status(400).json(error)
  }

}

const becomeStaff=async(req,res)=>{
  try{
    const email=req.body.email;
    const user=await User.findOne({
      email:email
    })
    if(!user){
      return res.status(400).json('No user with such email')
    }
    user.role='staff'
    await user.save()
    res.status(200).json(`${user.name} is now a staff`)
  }catch(error){
    res.status(400).json(error)
  }

}

const fireStaff=async(req,res)=>{
  try{
    const email=req.body.email;
    const user=await User.findOne({
      email:email
    })
    if(!user){
      return res.status(400).json('No user with such email')
    }
    user.role='customer'
    await user.save()
    res.status(200).json(`${user.name} is no longer a staff`)
  }catch(error){
    res.status(400).json(error)
  }

}


module.exports={register,login,verify,requestPasswordReset,resetPassword,becomeAdmin,becomeStaff,fireStaff};