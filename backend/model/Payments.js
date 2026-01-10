const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: 'Order'
    },
    amount: Number,
    paymentMethod: {
        type: String,
        enum: ['Wallet', 'Online', 'Cash'],
        default: 'Wallet'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Completed', 'Refunded'],
        default: 'Pending'
    },
    transactionId: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
