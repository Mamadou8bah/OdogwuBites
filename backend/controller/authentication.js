const User = require('../model/Users')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const {createToken,findTokenByToken}=require('../controller/verificationToken')
const {createResetToken,findResetTokenByToken}=require('../controller/resetToken')
const {createCart}=require('../controller/cart')
dotenv.config()

const {sendEmailVerificationEmail,sendPasswordResetEmail}=require('../utils/emailSender')

function getPublicBackendBaseUrl(req) {
  // Prefer explicit env in deployments.
  let raw =
    process.env.PUBLIC_BACKEND_URL ||
    process.env.BACKEND_PUBLIC_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    process.env.PUBLIC_URL ||
    process.env.APP_PUBLIC_URL;

  // Fall back to the current request host (works well on Render/most hosts).
  if (!raw && req?.get) {
    const host = req.get('host');
    if (host) {
      const proto = req.protocol || 'http';
      raw = `${proto}://${host}`;
    }
  }

  // Final fallback for local dev.
  if (!raw) {
    raw = `http://localhost:${process.env.PORT || 3000}`;
  }

  return raw.replace(/\/$/, '');
}


const signingKey = process.env.JWT_SECRET || 'dev_jwt_secret_change_me'

const register = async (req, res) => {
  try {
    const body = req.body || {};
    const name = (body.name || body.username || '').toString().trim();
    const address = (body.address || '').toString().trim();
    const phone = (body.phone ?? '').toString().trim();
    const password = (body.password || '').toString();
    const existingEmail = (body.email || '').toString().trim().toLowerCase();

    if (!name || !address || !phone || !existingEmail || !password) {
      return res.status(400).json({
        message: 'Please provide name, address, phone, email, and password.'
      });
    }

    const existingUser = await User.findOne({ email: existingEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'There is a user with this email, please login' });
    }

    const saltNumber = Number.parseInt(process.env.SALT_ROUNDS || '10', 10);
    const hashedPassword = await bcrypt.hash(password, saltNumber);

    const newUser = new User({
      name,
      address,
      phone,
      email: existingEmail,
      password: hashedPassword,
      role: 'customer'
    });

    const verificationCode = await createToken(newUser._id);
    await newUser.save();
    const link = `${getPublicBackendBaseUrl(req)}/auth/verify-email?code=${verificationCode}&email=${encodeURIComponent(newUser.email)}`;

    let emailSent = false;
    let emailError;
    try {
      await sendEmailVerificationEmail(newUser.email, newUser.name, link);
      emailSent = true;
    } catch (err) {
      emailError = err;
      // Don't fail registration if SMTP is not configured or temporarily down.
      console.error('Verification email send failed:', err?.message || err);
    }

    const payload = {
      message: emailSent
        ? "User Registered Successfully, please verify your email"
        : "User Registered Successfully, but we couldn't send a verification email. Please try again later or contact support.",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };

    if (process.env.NODE_ENV !== 'production') {
      payload.verificationLink = link;
      if (emailError) {
        payload.emailError = {
          message: emailError?.message,
          details: emailError?.details,
          code: emailError?.code,
        };
      }
    }

    res.status(201).json(payload);

  } catch (error) {
    const message = error?.message || 'Registration failed';
    const payload = { message };
    if (process.env.NODE_ENV !== 'production') {
      payload.details = error?.details || { code: error?.code };
    }
    res.status(400).json(payload);
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
      return res.redirect(302, 'https://odogwu-bites.vercel.app/login');
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
    const link = `${getPublicBackendBaseUrl()}/auth/reset-password?token=${Token}&email=${user.email}`;
    await sendPasswordResetEmail(user.email,user.name,link)

    res.status(200).json('Chech your email')
  }catch(error){
    const payload = {
      message: error?.message || 'Password reset request failed',
    };
    if (process.env.NODE_ENV !== 'production') {
      payload.details = error?.details || { code: error?.code };
    }
    res.status(400).json(payload);
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