const mongoose = require('mongoose');
const User = require('../model/Users');
const Payment = require('../model/Payments');
const Order = require('../model/Orders');

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const listUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    const paymentsAgg = await Payment.aggregate([
      {
        $match: {
          paymentStatus: { $in: ['Paid', 'Completed'] }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalPayments: { $sum: '$amount' }
        }
      }
    ]);

    const orderCountsAgg = await Order.aggregate([
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 }
        }
      }
    ]);

    const totalPaymentsByUserId = new Map(
      paymentsAgg.map((p) => [String(p._id), toNumber(p.totalPayments, 0)])
    );

    const orderCountByUserId = new Map(
      orderCountsAgg.map((o) => [String(o._id), toNumber(o.orderCount, 0)])
    );

    res.status(200).json({
      users: users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        address: u.address,
        role: u.role,
        verified: u.verified,
        balance: u.balance,
        createdAt: u.createdAt,
        totalPayments: totalPaymentsByUserId.get(String(u._id)) || 0,
        orderCount: orderCountByUserId.get(String(u._id)) || 0
      }))
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await User.findById(id).select('-password').lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const paymentsAgg = await Payment.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(id),
          paymentStatus: { $in: ['Paid', 'Completed'] }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalPayments: { $sum: '$amount' }
        }
      }
    ]);

    const totalPayments = paymentsAgg[0]?.totalPayments ? toNumber(paymentsAgg[0].totalPayments, 0) : 0;

    const orderCount = await Order.countDocuments({ userId: id });

    const recentOrders = await Order.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('total status createdAt items')
      .lean();

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        verified: user.verified,
        balance: user.balance,
        createdAt: user.createdAt
      },
      metrics: {
        totalPayments,
        orderCount
      },
      recentOrders: recentOrders.map((o) => ({
        _id: o._id,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
        item: Array.isArray(o.items) && o.items.length > 0 ? o.items[0].title : '—'
      }))
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { listUsers, getUserById };
