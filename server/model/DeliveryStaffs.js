const mongoose=require('mongoose')

const deliveryStaffSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    Orders:[
        {
            type:mongoose.Types.ObjectId,
            ref:'Order'
        }
    ]
})

const DeliveryStaff=mongoose.model('DeliveryStaff',deliveryStaffSchema);

module.exports=DeliveryStaff;