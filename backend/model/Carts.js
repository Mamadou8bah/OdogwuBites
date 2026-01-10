const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        subTotal: {
            type: Number,
            default: 0
        }
    }],
    totalAmount: {
        type: Number,
        default: 0
    }
});

cartSchema.pre('save', function(next) {
    let total = 0;
    if (this.items) {
        this.items.forEach(item => {
            item.subTotal = item.price * item.quantity;
            total += item.subTotal;
        });
    }
    this.totalAmount = total;
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;