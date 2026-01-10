const mongoose =require('mongoose')

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        email:{
            type:String,
            unique:true,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        role: {
        type: String,
        enum: ['customer', 'admin','staff'],
        default: 'customer'
        },
        phone:{
            type:Number,
            required:true
        },
        createdAt:{
            type:Date, 
            default:Date.now
        },
        cart:{
            type:mongoose.Types.ObjectId,
            ref:'Cart'
        },
        verified:{
            type:Boolean,
            default:false
        },
        balance:{
            type:Number,
            default:0
        }
    }
)
const User=mongoose.model('User',userSchema);
module.exports=User;