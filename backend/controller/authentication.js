const User = require('../model/Users')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const {createToken,findTokenByToken}=require('../controller/verificationToken')
const {createResetToken,findResetTokenByToken}=require('../controller/resetToken')
const {createCart}=require('../controller/cart')
dotenv.config()

const {sendEmailVerificationEmail,sendPasswordResetEmail}=require('../utils/emailSender')


const signingKey = process.env.JWT_SECRET || 'dev_jwt_secret_change_me'

const register = async (req, res) => {
  try {
    const existingEmail = req.body.email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: existingEmail })
    if (existingUser) {
      return res.status(400).json('There is a user with this email, please login');
    }

    const userPassword = req.body.password;
    const saltNumber = Number.parseInt(process.env.SALT_ROUNDS || '10', 10);
    const hashedPassword = await bcrypt.hash(userPassword, saltNumber);

    const newUser = new User(req.body);
    newUser.password = hashedPassword;
    newUser.role = 'customer';

    const verificationCode = await createToken(newUser._id);
    await newUser.save();
    const link = `http://localhost:3000/auth/verify-email?code=${verificationCode}&email=${newUser.email}`;
    await sendEmailVerificationEmail(newUser.email,newUser.name,link)

    const payload = {
      message: "User Registered Successfully, please verify your email",
      User: newUser
    };

    if (process.env.NODE_ENV !== 'production') {
      payload.verificationLink = link;
    }

    res.status(201).json(payload);

  } catch (error) {
    res.status(400).json(error);
  }
}

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email= email.trim().toLowerCase();

    console.log(req.body)
    const user = await User.findOne({ email });
    console.log(user);

    if (user==null) {
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
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance
      }
    });

  } catch (error) {
    res.status(400).json(error.message);
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
        await createCart(user._id);
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

const fireStaff = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json('No user with such email');
    }
    user.role = 'customer';
    await user.save();
    res.status(200).json(`${user.name} is no longer a staff`);
  } catch (error) {
    res.status(400).json(error);
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error);
  }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, address } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json(error);
  }
}

module.exports={register,login,verify,requestPasswordReset,resetPassword,becomeAdmin,becomeStaff,fireStaff,getProfile,updateProfile};