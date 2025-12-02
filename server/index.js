const express=require('express')
const {connectToDatabase}=require('./config/dbconfig')

const AuthRouter=require('./route/authentication')
const MenuRouter=require('./route/menu')
const CategoryRouter=require('./route/category')
const CartRouter=require('./route/cart')
const OrderRouter=require('./route/order')
const PaymentRouter=require('./route/payment')
const DeliveryStaffRouter=require('./route/deliveryStaff')
const app=express()

connectToDatabase();
app.use(express.json());
app.use('/auth', AuthRouter);
app.use('/menu', MenuRouter);
app.use('/category', CategoryRouter);
app.use('/cart', CartRouter);
app.use('/order', OrderRouter);
app.use('/payment', PaymentRouter);
app.use('/delivery-staff', DeliveryStaffRouter);

app.listen(3000,
    ()=>{
        console.log('listening at port 3000')
    }
)