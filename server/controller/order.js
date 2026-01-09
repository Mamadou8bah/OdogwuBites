const Order=require('../model/Orders');
const Payment = require('../model/Payments');
const DeliveryStaff = require('../model/DeliveryStaffs');
const User = require('../model/Users');

const createOrder=async(req,res)=>{
    try{
        const userId=req.user._id;
        const {deliveryFee,paymentMethod,deliveryType,notes}=req.body;
        
        const user = await User.findById(userId);
        const Cart = require('../model/Carts');
        const cart = await Cart.findOne({ userId });
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const totalOrderAmount = (cart.totalAmount || 0) + (deliveryFee || 0);

        if (paymentMethod === 'Wallet') {
            if (user.balance < totalOrderAmount) {
                return res.status(400).json({ message: 'Insufficient amount in wallet' });
            }
            user.balance -= totalOrderAmount;
            await user.save();
        }

        const order=new Order({
            userId:userId,
            deliveryFee:deliveryFee,
            paymentMethod:paymentMethod,
            notes:notes,
            deliveryType:deliveryType
        });

        if (deliveryType === 'Delivery') {
            const staffMembers = await DeliveryStaff.find();
            if (staffMembers.length > 0) {
                staffMembers.sort((a, b) => a.Orders.length - b.Orders.length);
                const selectedStaff = staffMembers[0];
                
                order.deliveryStaffId = selectedStaff._id;
                selectedStaff.Orders.push(order._id);
                await selectedStaff.save();
            }
        }

        await order.save()

        await Payment.create({
            userId,
            orderId: order._id,
            amount: order.total,
            paymentMethod: 'Wallet',
            paymentStatus: 'Completed',
            notes: 'Paid via Wallet'
        });

        res.status(200).json({ message: "Order placed successfully using wallet balance", order });
    }catch(error){
        console.error(error);
        res.status(400).json('Order Failed')
    }
}
const getOrdersByUserId=async(req,res)=>{
    try{
        const userId=req.user._id;
        const orders=await Order.find({userId:userId}).populate('menuItems');
        res.status(200).json(orders)
    }catch(error){
        res.status(400).json(error)
    }
}

const cancelOrder=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const order=await Order.findById(orderId);
        if(!order){
            return res.status(400).json('No order with such ID')
        }
        order.status='Cancelled'
        await order.save()
        res.status(200).json('Order Cancelled successfully')

    }catch(error){
        res.status(400).json(error)
    }
}

const acceptOrder=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const order=await Order.findById(orderId);
        if(!order){
            return res.status(400).json('No order with such ID')
        }
        order.status='Accepted'
        await order.save()
        res.status(200).json('Order Accepted successfully')
    }catch(error){
        res.status(400).json(error)
    }
}
const deliverOrder=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const order=await Order.findById(orderId);
        if(!order){
            return res.status(400).json('No order with such ID')
        }
        order.status='Delivered'
        await order.save()
        res.status(200).json('Order Delivered successfully')
    }catch(error){
        res.status(400).json(error)
    }
}
const getAllOrders=async(req,res)=>{
    try{
        const orders=await Order.find().populate('menuItems');
        res.status(200).json(orders)
    }catch(error){
        res.status(400).json(error)
    }
}

const getOrderById=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const order=await Order.findById(orderId).populate('menuItems');
        if(!order){
            return res.status(400).json('No order with such ID')
        }
        res.status(200).json(order)
    }catch(error){
        res.status(400).json(error)
    }
}
module.exports={createOrder,getOrdersByUserId,cancelOrder,acceptOrder,deliverOrder,getAllOrders,getOrderById}