const Order = require('../model/Orders');
const User = require('../model/Users');
const MenuItem = require('../model/MenuItems');

const getDashboardStats = async (req, res) => {
    try {
        console.log('Fetching dashboard stats...');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentYear = today.getFullYear();
        const lastYear = currentYear - 1;

        const [ordersToday, usersToday, totalMenuItems] = await Promise.all([
            Order.find({ createdAt: { $gte: today } }),
            User.countDocuments({ createdAt: { $gte: today } }),
            MenuItem.countDocuments()
        ]);

        const totalRevenueToday = ordersToday.reduce((sum, order) => sum + order.total, 0);
        const totalOrdersToday = ordersToday.length;

        console.log('Calculating trends...');
        const getTrend = async (model, dateField = 'createdAt', sumField = null) => {
            const trend = [];
            for (let i = 0; i < 24; i += 2) {
                const start = new Date(today);
                start.setHours(i, 0, 0, 0);
                const end = new Date(today);
                end.setHours(i + 2, 0, 0, 0);
                
                let value = 0;
                if (sumField) {
                    const results = await model.find({ [dateField]: { $gte: start, $lt: end } });
                    value = results.reduce((sum, doc) => sum + (doc[sumField] || 0), 0);
                } else {
                    value = await model.countDocuments({ [dateField]: { $gte: start, $lt: end } });
                }
                trend.push({ hour: `${i.toString().padStart(2, '0')}:00`, value });
            }
            return trend;
        };

        const revenueTrend = await getTrend(Order, 'createdAt', 'total');
        const ordersTrend = await getTrend(Order, 'createdAt');
        const usersTrend = await getTrend(User, 'createdAt');
        const productsTrend = revenueTrend.map(h => ({ ...h, value: Math.floor(totalMenuItems / 12) }));

        // Revenue Comparison (This Year vs Last Year)
        const getMonthlyRevenue = async (year) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const data = [];
            for (let i = 0; i < 12; i++) {
                const start = new Date(year, i, 1);
                const end = new Date(year, i + 1, 1);
                const results = await Order.find({ createdAt: { $gte: start, $lt: end }, status: { $ne: 'Cancelled' } });
                const total = results.reduce((sum, order) => sum + order.total, 0);
                data.push({ month: months[i], value: total });
            }
            return data;
        };

        const revenueThisYear = await getMonthlyRevenue(currentYear);
        const revenueLastYear = await getMonthlyRevenue(lastYear);

        // Status Distribution
        const statuses = ['Pending', 'Accepted', 'Delivered', 'Cancelled'];
        const statusDistribution = await Promise.all(statuses.map(async (status) => {
            const count = await Order.countDocuments({ status });
            return { status, count };
        }));

        // Top Customers (Top 5 spenders)
        const topCustomersLimit = await Order.aggregate([
            { $match: { status: 'Delivered' } },
            { $group: { _id: '$userId', totalSpent: { $sum: '$total' } } },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userDetails' } },
            { $unwind: '$userDetails' },
            { $project: { name: '$userDetails.name', totalSpent: 1 } }
        ]);
        const topCustomers = topCustomersLimit.map(c => ({ name: c.name, totalSpent: c.totalSpent }));

        res.status(200).json({
            todayRevenue: totalRevenueToday,
            todayOrders: totalOrdersToday,
            todayUsers: usersToday,
            totalProducts: totalMenuItems,
            trends: {
                revenue: revenueTrend,
                orders: ordersTrend,
                users: usersTrend,
                products: productsTrend
            },
            revenueComparison: {
                thisYear: revenueThisYear,
                lastYear: revenueLastYear
            },
            statusDistribution,
            topCustomers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
