const mongoose=require('mongoose')

const cartSchema= new mongoose.Schema({
    userId:{
       type: mongoose.Types.ObjectId,
       ref:'User'
    }, 
    menuItems:[
        {
            type:mongoose.Types.ObjectId,
            ref:'MenuItem'
        }     
    ],
    discount:Number,
    subtotal:Number
})

const Cart=mongoose.model('Cart',cartSchema)
module.exports=Cart;