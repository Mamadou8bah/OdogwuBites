const VerificationToken=require('../model/VerificationToken');
const crypto=require('crypto')
const createToken= async (userId)=>{
    try{
        const token=crypto.randomBytes(32).toString('hex')
        const Token=await VerificationToken.create({
            userId:userId,
            token:token
        });
        return token;
    }catch(error){
        throw error;
    }
}

const findTokenByToken= async(token)=>{
    try{
        const Token= await VerificationToken.findOne({token:token})
        return Token
    }catch(error){
        throw error;
    }
}
module.exports={createToken,findTokenByToken};