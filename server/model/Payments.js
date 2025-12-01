const mongoose=require('mongoose');

const paymentScheam=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    orderId:{
        type:mongoose.Types.ObjectId,
        ref:'Order'
    },
    amount:Number,
     paymentMethod:{
            type:String,
            emum:[
                'Cash','Wave'
            ],
        },
     paymentStatus:{
            type:String,
            emum:[
                'Pending','Paid','Failed'
            ],
            default:'Pending'
    },
    transactionId:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Payment=mongoose.model('Payment',paymentScheam);
module.exports=Payment;
