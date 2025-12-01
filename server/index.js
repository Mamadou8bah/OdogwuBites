const express=require('express')
const {connectToDatabase}=require('./config/dbconfig')

const AuthRouter=require('./route/authentication')
const MenuRouter=require('./route/menu')
const CategoryRouter=require('./route/category')
const app=express()

connectToDatabase();
app.use(express.json());
app.use('/auth', AuthRouter);
app.use('/menu', MenuRouter);
app.use('/category', CategoryRouter);

app.listen(3000,
    ()=>{
        console.log('listening at port 3000')
    }
)