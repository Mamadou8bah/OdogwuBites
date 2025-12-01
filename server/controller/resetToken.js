const ResetToken=require('../model/ResetToken')
const crypto=require('crypto')
const createResetToken=async(userId)=>{
    try{
        const token=crypto.randomBytes(32).toString('hex')

        const newToken=await ResetToken.create({
            userId:userId,
            token:token
        })
        return token;
    }catch(error){
        throw error;
    }
}

const findResetTokenByToken=async(token)=>{
    try{
        const Token =await ResetToken.findOne({
            token:token
        })
        
        return Token;

    }catch(error){
        throw error;
    }
}
module.exports={createResetToken,findResetTokenByToken};