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
        enum: ['Cash', 'Online'],
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    transactionId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
