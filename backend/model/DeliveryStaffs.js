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
    // Tracks how many assigned orders have already been credited to the staff user's wallet balance.
    // Earnings rule: 50 * number of orders assigned.
    paidOrdersCount: {
        type: Number,
        default: 0,
        min: 0
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