const express=require('express')
const cors = require('cors');
const dotenv = require('dotenv');
const {connectToDatabase}=require('./config/dbconfig')

const AuthRouter=require('./route/authentication')
const MenuRouter=require('./route/menu')
const CategoryRouter=require('./route/category')
const CartRouter=require('./route/cart')
const OrderRouter=require('./route/order')
const PaymentRouter=require('./route/payment')
const DeliveryStaffRouter=require('./route/deliveryStaff')
const DashboardRouter=require('./route/dashboard')
const app=express()

dotenv.config();

connectToDatabase();
app.use(cors({
    origin: process.env.CORS_ORIGIN || true,
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

const port = process.env.PORT || 3000;

app.listen(port,
    ()=>{
        console.log(`listening at port ${port}`)
    }
)