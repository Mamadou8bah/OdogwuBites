const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    menuItemId:{
        type:mongoose.Types.ObjectId,
        ref:'MenuItem'
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    Comment:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;