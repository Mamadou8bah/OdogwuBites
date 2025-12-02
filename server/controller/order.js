const Order=require('../model/Orders');
const Payment = require('../model/Payments');
const DeliveryStaff = require('../model/DeliveryStaffs');
const ModemPay = require('modem-pay');

const modempay = new ModemPay(process.env.MODEM_PAY_SECRET_KEY);

const createOrder=async(req,res)=>{
    try{
        const userId=req.user._id;
        const {deliveryFee,paymentMethod,deliveryType,notes}=req.body;
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

        if (paymentMethod === 'Online') {
            const intent = await modempay.paymentIntents.create({
                amount: order.total,
                currency: "GMD",
                return_url: "http://localhost:3000/payment-success",
                cancel_url: "http://localhost:3000/payment-failed",
                metadata: {
                    userId: userId.toString(),
                    orderId: order._id.toString()
                }
            });

            await Payment.create({
                userId,
                orderId: order._id,
                amount: order.total,
                paymentMethod: 'Online',
                paymentStatus: 'Pending',
                transactionId: intent.data.id 
            });

            return res.status(200).json({
                message: "Order created, proceed to payment",
                order: order,
                paymentUrl: intent.data.payment_link
            });
        } else {
            await Payment.create({
                userId,
                orderId: order._id,
                amount: order.total,
                paymentMethod: 'Cash',
                paymentStatus: 'Pending'
            });
            res.status(200).json(order)
        }
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

const getOrderByid=async(req,res)=>{
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
module.exports={createOrder,getOrdersByUserId,cancelOrder,acceptOrder,deliverOrder,getAllOrders,getOrderByid}