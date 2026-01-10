const ModemPay = require('modem-pay');
const mongoose = require('mongoose');
const Payment = require('../model/Payments');
const User = require('../model/Users');

const modempay = process.env.MODEM_PAY_SECRET_KEY
    ? new ModemPay(process.env.MODEM_PAY_SECRET_KEY)
    : null;

const deposit = async (req, res) => {
    try {
        const userId = req.user._id;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Local/dev fallback when ModemPay isn't configured.
        if (!modempay) {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.balance = (user.balance || 0) + Number(amount);
            await user.save();

            await Payment.create({
                userId,
                amount,
                paymentMethod: 'Wallet',
                paymentStatus: 'Completed',
                notes: 'Wallet Deposit (dev)'
            });

            return res.status(200).json({
                message: "Deposit completed (dev)",
                balance: user.balance
            });
        }

        const intent = await modempay.paymentIntents.create({
            amount: amount,
            currency: "GMD",
            return_url: `http://localhost:3000/payment/verify-deposit?userId=${userId}&amount=${amount}`,
            cancel_url: "http://localhost:3000/payment-failed",
            metadata: {
                userId: userId.toString(),
                type: 'DEPOSIT'
            }
        });

        await Payment.create({
            userId,
            amount,
            paymentMethod: 'Online',
            paymentStatus: 'Pending',
            transactionId: intent.data.id,
            notes: 'Wallet Deposit'
        });

        return res.status(200).json({
            message: "Deposit initiated",
            paymentUrl: intent.data.payment_link
        });

    } catch (error) {
        console.error("Deposit Error:", error);
        res.status(500).json({ message: "Error processing deposit" });
    }
};

const verifyDeposit = async (req, res) => {
    try {
        const { userId, amount } = req.query;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.balance = (user.balance || 0) + Number(amount);
        await user.save();

        res.send("<h1>Deposit Successful! Your balance has been updated.</h1><script>setTimeout(() => window.close(), 3000)</script>");
    } catch (error) {
        console.error("Verify Deposit Error:", error);
        res.status(500).send("Error verifying deposit");
    }
};

module.exports = { deposit, verifyDeposit };
