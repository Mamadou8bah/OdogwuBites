// Most popular menu items
export const popularMenuItems = [
  { name: 'Jollof Rice', orders: 120 },
  { name: 'Fried Chicken', orders: 95 },
  { name: 'Pizza', orders: 80 },
  { name: 'Burger', orders: 75 },
  { name: 'Pounded Yam', orders: 60 },
];

// Delivery performance (on-time vs late)
export const deliveryPerformance = [
  { status: 'On Time', count: 70 },
  { status: 'Late', count: 8 },
];

// Customer retention (new vs returning)
export const customerRetention = [
  { type: 'New', count: 30 },
  { type: 'Returning', count: 55 },
];

// Payment method distribution
export const paymentMethods = [
  { method: 'Card', count: 60 },
  { method: 'Cash', count: 20 },
  { method: 'Transfer', count: 5 },
];
// Average order value by day
export const avgOrderValueByDay = [
  { day: '2026-01-01', avgValue: 100 },
  { day: '2026-01-02', avgValue: 120 },
  { day: '2026-01-03', avgValue: 95 },
  { day: '2026-01-04', avgValue: 130 },
  { day: '2026-01-05', avgValue: 125 },
  { day: '2026-01-06', avgValue: 140 },
  { day: '2026-01-07', avgValue: 150 },
];

// Peak order hours (number of orders per hour)
export const ordersByHour = [
  { hour: '08:00', count: 2 },
  { hour: '09:00', count: 4 },
  { hour: '10:00', count: 7 },
  { hour: '11:00', count: 10 },
  { hour: '12:00', count: 15 },
  { hour: '13:00', count: 18 },
  { hour: '14:00', count: 12 },
  { hour: '15:00', count: 9 },
  { hour: '16:00', count: 8 },
  { hour: '17:00', count: 11 },
  { hour: '18:00', count: 14 },
  { hour: '19:00', count: 16 },
  { hour: '20:00', count: 13 },
  { hour: '21:00', count: 7 },
  { hour: '22:00', count: 3 },
];
// Top customers by total spent
export const topCustomers = [
  { name: 'Jane Doe', totalSpent: 5200, orders: 18 },
  { name: 'John Smith', totalSpent: 4300, orders: 15 },
  { name: 'Mary Johnson', totalSpent: 3900, orders: 13 },
  { name: 'Chris Lee', totalSpent: 3500, orders: 12 },
  { name: 'Patricia Brown', totalSpent: 3200, orders: 10 },
];
// charts-data.js
// Mock data for dashboard charts

// Total revenue against days (last 7 days)
export const revenueByDay = [
  { day: '2026-01-01', revenue: 1200 },
  { day: '2026-01-02', revenue: 1500 },
  { day: '2026-01-03', revenue: 1100 },
  { day: '2026-01-04', revenue: 1800 },
  { day: '2026-01-05', revenue: 1700 },
  { day: '2026-01-06', revenue: 2000 },
  { day: '2026-01-07', revenue: 2200 },
];

// Mini-card sparklines (last 7 days)
export const todayRevenueTrend = [
  { hour: '08:00', value: 180 },
  { hour: '10:00', value: 260 },
  { hour: '12:00', value: 420 },
  { hour: '14:00', value: 380 },
  { hour: '16:00', value: 520 },
  { hour: '18:00', value: 610 },
  { hour: '20:00', value: 540 },
];

export const todayOrdersTrend = [
  { hour: '08:00', value: 2 },
  { hour: '10:00', value: 4 },
  { hour: '12:00', value: 9 },
  { hour: '14:00', value: 7 },
  { hour: '16:00', value: 11 },
  { hour: '18:00', value: 13 },
  { hour: '20:00', value: 10 },
];

export const todayProductsTrend = [
  { hour: '08:00', value: 1 },
  { hour: '10:00', value: 2 },
  { hour: '12:00', value: 3 },
  { hour: '14:00', value: 3 },
  { hour: '16:00', value: 4 },
  { hour: '18:00', value: 5 },
  { hour: '20:00', value: 4 },
];

export const todayVisitorsTrend = [
  { hour: '08:00', value: 60 },
  { hour: '10:00', value: 95 },
  { hour: '12:00', value: 140 },
  { hour: '14:00', value: 120 },
  { hour: '16:00', value: 170 },
  { hour: '18:00', value: 210 },
  { hour: '20:00', value: 185 },
];

// Revenue chart (this year vs last year)
export const revenueThisYearByMonth = [
  { month: 'Jan', value: 120000 },
  { month: 'Feb', value: 98000 },
  { month: 'Mar', value: 160000 },
  { month: 'Apr', value: 240000 },
  { month: 'May', value: 310000 },
  { month: 'Jun', value: 260000 },
  { month: 'Jul', value: 285000 },
];

export const revenueLastYearByMonth = [
  { month: 'Jan', value: 90000 },
  { month: 'Feb', value: 105000 },
  { month: 'Mar', value: 130000 },
  { month: 'Apr', value: 115000 },
  { month: 'May', value: 170000 },
  { month: 'Jun', value: 210000 },
  { month: 'Jul', value: 255000 },
];

// More chart data will be added below...

// Order status distribution
export const orderStatusData = [
  { status: 'Pending', count: 12 },
  { status: 'Delivered', count: 45 },
  { status: 'Canceled', count: 5 },
];

// Product status breakdown (donut)
export const productStatusData = [
  { status: 'Delivered', count: 62 },
  { status: 'Pending', count: 21 },
  { status: 'Canceled', count: 7 },
];

// Best restaurants (bar)
export const bestRestaurants = [
  { name: 'Heart Break', value: 18000 },
  { name: 'KFC', value: 26000 },
  { name: 'Dominos', value: 30000 },
  { name: 'McDonalds', value: 14000 },
  { name: 'Jnr Smash', value: 24000 },
  { name: 'Mr Turkey', value: 32000 },
  { name: 'Food Bae', value: 15500 },
  { name: 'Pizza Hut', value: 27000 },
];
