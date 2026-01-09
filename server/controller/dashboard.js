const Order = require('../model/Orders');
const User = require('../model/Users');
const MenuItem = require('../model/MenuItems');

const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const ordersToday = await Order.find({ createdAt: { $gte: today } });
        const totalRevenueToday = ordersToday.reduce((sum, order) => sum + order.total, 0);
        const totalOrdersToday = ordersToday.length;

        const usersToday = await User.countDocuments({ createdAt: { $gte: today } });
        const totalMenuItems = await MenuItem.countDocuments();

        // Simple trend simulation for charts (last 24 hours)
        const hourlyRevenue = [];
        for (let i = 0; i < 24; i++) {
            const start = new Date(today);
            start.setHours(i, 0, 0, 0);
            const end = new Date(today);
            end.setHours(i + 1, 0, 0, 0);
            
            const revenue = ordersToday
                .filter(o => o.createdAt >= start && o.createdAt < end)
                .reduce((sum, o) => sum + o.total, 0);
            
            hourlyRevenue.push({ hour: `${i}:00`, value: revenue });
        }

        res.status(200).json({
            todayRevenue: totalRevenueToday,
            todayOrders: totalOrdersToday,
            todayUsers: usersToday,
            totalProducts: totalMenuItems,
            revenueTrend: hourlyRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
