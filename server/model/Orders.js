const mongose=require('mongoose')

const orderSchema=new mongose.Schema(
    {
        userId:{
            type:mongose.Types.ObjectId,
            ref:'User'
        },
        MenuItems:[ 
            {
                type:mongose.Types.ObjectId,
                ref:'MenuItem'
            }
        ],
        subtotal:Number,
        deliveryFee:Number,
        total:Number,
        paymentMethod:{
            type:String,
            emum:[
                'Cash','Wave'
            ],
        },
        deliveryType:{
            type:String,
            enum:['Pickup','Delivery']
        },
        deliveryAddress:String,
        status:{
            type:String,
            enum:[
                'Pending',
                'Accepted',
                'Delivered',
                'Cancelled'
            ],
            default:'Pending'
        },
        notes:String,
        createdAt:{
            type:Date,
            default:Date.now
        }
    },{
        timestamps:true
    }
)

const Order= mongose.model('Order',orderSchema);
module.exports=Order;

