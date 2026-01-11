require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./config/dbconfig');
const { seedCategories } = require('./utils/seedCategories');

const AuthRouter = require('./route/authentication');
const MenuRouter = require('./route/menu');
const CategoryRouter = require('./route/category');
const CartRouter = require('./route/cart');
const OrderRouter = require('./route/order');
const PaymentRouter = require('./route/payment');
const DeliveryStaffRouter = require('./route/deliveryStaff');
const DashboardRouter = require('./route/dashboard');
const UsersRouter = require('./route/users');

const app = express();

// Needed behind reverse proxies (Render, Nginx, etc.) so req.protocol reflects X-Forwarded-Proto.
app.set('trust proxy', 1);

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:4200'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use('/auth', AuthRouter);
app.use('/menu', MenuRouter);
app.use('/category', CategoryRouter);
app.use('/cart', CartRouter);
app.use('/order', OrderRouter);
app.use('/payment', PaymentRouter);
app.use('/delivery-staff', DeliveryStaffRouter);
app.use('/dashboard', DashboardRouter);
app.use('/users', UsersRouter);

const port = process.env.PORT || 3000;

async function startServer() {
    await connectToDatabase();
    await seedCategories();
    app.listen(port, () => {
        console.log(`listening at port ${port}`);
    });
}

startServer().catch((error) => {
    console.error('Server startup failed', error);
    process.exit(1);
});