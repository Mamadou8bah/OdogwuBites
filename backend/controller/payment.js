const ModemPay = require('modem-pay');
const mongoose = require('mongoose');
const Payment = require('../model/Payments');
const User = require('../model/Users');

function getPublicFrontendBaseUrl(req) {
    // Prefer explicit env in deployments.
    let raw =
        process.env.PUBLIC_FRONTEND_URL ||
        process.env.FRONTEND_PUBLIC_URL ||
        process.env.FRONTEND_URL;

    // Vercel provides VERCEL_URL without protocol.
    if (!raw && process.env.VERCEL_URL) {
        raw = `https://${process.env.VERCEL_URL}`;
    }

    // Fall back to request origin when API is called from the browser.
    if (!raw && req?.get) {
        const origin = req.get('origin');
        if (origin) raw = origin;
    }

    // Final fallback for local dev.
    if (!raw) {
        raw = 'http://localhost:4200';
    }

    return raw.replace(/\/$/, '');
}

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
            return_url: `${getPublicFrontendBaseUrl(req)}/payment/verify-deposit?userId=${userId}&amount=${amount}`,
            cancel_url: `${getPublicFrontendBaseUrl(req)}/payment-failed`,
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

const getAllPayments=async(req,res)=>{
    try{
        const payments=await Payment.find();
        res.status(200).json(payments);
    }catch(error){
        res.status(400).json({message:error.message})
    }
}

const getUserPayments=async(req,res)=>{
    try{
        const userId=req.params.userId;
        const payments=await Payment.find({userId:mongoose.Types.ObjectId(userId)});
        res.status(200).json(payments);
    }catch(error){
        res.status(400).json({message:error.message})
    }
}

module.exports = { deposit, verifyDeposit, getAllPayments, getUserPayments };