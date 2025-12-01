const mongoose= require('mongoose')

const menuItemSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    isAvailable:Boolean,
    discount:Number,
    imagePublicId:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const MenuItem=mongoose.model('MenuItem',menuItemSchema);
module.exports=MenuItem;