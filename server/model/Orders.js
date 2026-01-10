const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    clientRequestId: {
      type: String,
      index: true
    },
    items: [
      {
        menuItemId: { type: mongoose.Types.ObjectId, ref: 'MenuItem', required: true },
        title: { type: String, required: true },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        subTotal: { type: Number, required: true }
      }
    ],
    itemsTotal: { type: Number, default: 0 },
    menuItems: [{ type: mongoose.Types.ObjectId, ref: 'MenuItem' }],
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['Wallet', 'Online', 'Cash'],
      default: 'Wallet'
    },
    deliveryType: { 
      type: String,
      enum: ['Pickup', 'Delivery']
    },
    address: { type: String },
    phone: { type: String },
    city: { type: String },
    postalCode: { type: String },
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

orderSchema.index({ userId: 1, clientRequestId: 1 }, { unique: true, sparse: true });

orderSchema.pre('save', function (next) {
  try {
    const items = Array.isArray(this.items) ? this.items : [];
    const itemsTotal = items.reduce((sum, it) => sum + (Number(it.subTotal) || 0), 0);
    this.itemsTotal = itemsTotal;
    this.total = itemsTotal + (Number(this.deliveryFee) || 0);
    this.menuItems = items.map(it => it.menuItemId);
    next();
  } catch (err) {
    next(err);
  }
});


const Order = mongoose.model('Order', orderSchema);

// Auto-populate menu items and user details for better API access
const autoPopulate = function(next) {
  this.populate('userId')
      .populate('items.menuItemId')
      .populate('menuItems')
      .populate({
        path: 'deliveryStaffId',
        populate: { path: 'userId', select: 'name email' }
      });
  next();
};

orderSchema.pre('find', autoPopulate)
           .pre('findOne', autoPopulate)
           .pre('findById', autoPopulate);

module.exports = Order;
