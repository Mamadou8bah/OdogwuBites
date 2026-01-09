const mongoose=require('mongoose')

const deliveryStaffSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    employeeId: {
        type: String,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'on_delivery', 'off_duty', 'suspended', 'on_break'],
        default: 'active'
    },
    employmentType: {
        type: String,
        enum: ['full_time', 'part_time', 'contractor'],
        default: 'full_time'
    },
    vehicle: {
        type: { type: String, default: 'motorcycle' },
        make: String,
        model: String,
        year: Number,
        color: String,
        licensePlate: String
    },
    hireDate: {
        type: Date,
        default: Date.now
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