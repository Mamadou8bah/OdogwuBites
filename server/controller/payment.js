const ModemPay = require('modem-pay');
const mongoose = require('mongoose');
const Payment = require('../model/Payments');
const Cart = require('../model/Carts');

const modempay = new ModemPay(process.env.MODEM_PAY_SECRET_KEY);

const checkout = async (req, res) => {
    try {
        const { userId, paymentMethod } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const orderId = new mongoose.Types.ObjectId();

        if (paymentMethod === 'Online') {
            const intent = await modempay.paymentIntents.create({
                amount: cart.totalAmount,
                currency: "GMD",
                return_url: "http://localhost:3000/payment-success",
                cancel_url: "http://localhost:3000/payment-failed",
                metadata: {
                    userId: userId.toString(),
                    orderId: orderId.toString()
                }
            });

            await Payment.create({
                userId,
                orderId,
                amount: cart.totalAmount,
                paymentMethod: 'Online',
                paymentStatus: 'Pending',
                transactionId: intent.data.id 
            });

            return res.status(200).json({
                message: "Payment initiated",
                paymentUrl: intent.data.payment_link 
            });

        } else {
            await Payment.create({
                userId,
                orderId,
                amount: cart.totalAmount,
                paymentMethod: 'Cash',
                paymentStatus: 'Pending'
            });

            return res.status(200).json({ message: "Order placed successfully" });
        }

    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "Error processing checkout" });
    }
};

module.exports = { checkout };
