const mongoose = require('mongoose');
const Cart = require('./Carts');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    menuItems: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'MenuItem'
      }],
    deliveryFee: Number,
    total: Number,
    paymentMethod: {
      type: String,
      enum: ['Wallet', 'Online', 'Cash'],
      default: 'Wallet'
    },
    deliveryType: {
      type: String,
      enum: ['Pickup', 'Delivery']
    },
    deliveryStaffId: {
      type: mongoose.Types.ObjectId,
      ref: 'DeliveryStaff'
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

orderSchema.pre('save', async function(next) {
  try {
    const cart = await Cart.findOne({ userId: this.userId });
    if (!cart) {
      this.total = this.deliveryFee || 0;
      this.menuItems = [];
    } else {
      this.total = (cart.totalAmount || 0) + (this.deliveryFee || 0);
      this.menuItems = cart.items.map(item => item.menuItem);
    }
    next();
  } catch (err) {
    next(err);
  }
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
