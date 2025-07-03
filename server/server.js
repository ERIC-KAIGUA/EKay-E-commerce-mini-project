import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser, { signedCookie } from 'cookie-parser';
import dotenv from 'dotenv'; // reading .env files
import { fileURLToPath } from 'url'; // used for line 16
import { dirname } from 'path'; // used for line 16

import productsrouter from './routes/products-router.js';
import cartrouter from '../server/cart/cart-route.js';
import adminrouter from './admin/useradmin.js';
import usersrouter from './userroutes/userRoutes.js';
import orderRouter from './orders/order-routes.js';
import { isAdmin, isAuthenticated } from './middleware/auth-middlware.js';

const app = express()
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url); // used for line 16
const __dirname = dirname(__filename); //used for line 16
const db = process.env.MONGO_URI
const corsOptions = {
    origin:'http://127.0.0.1:5500',
    credentials: true,
    optionsSuccessStatus:200
};

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))
app.use(session({
    secret:"me",
    saveUninitialized:false,
    resave:false,
    store:MongoStore.create({
        mongoUrl:"mongodb://localhost:27017/ekay",
        collectionName:"sessions"
    }),
    cookie:{
        maxAge:5000*2,
        httpOnly:true,
        signed:true
    }
}))
app.use(cookieParser("me"))
dotenv.config() // reads .env files
app.use(express.static(path.join(__dirname, '../client'))); // loading static files like IMG's from frontend correctly
mongoose
.connect("mongodb://localhost:27017/ekay")
.then(()=>console.log("Connected to Database"))
.catch((err)=> console.log(`err: ${err}`))

app.use(productsrouter)
app.use(cartrouter)
app.use(adminrouter)
app.use(usersrouter)
app.use(orderRouter)


app.get('/', (req,res)=>{
    
     res.sendFile(path.join(__dirname,'../client','sign-in.html'))
})


app.get('/dashboard', isAuthenticated, (req,res)=>{
    res.send(`Welcome ${req.session.user.name}`)
})

app.get('/admin/dashboard', isAdmin,(req,res)=>{
    res.send(`Welcome Admin ${req.session.user.name}`)
})

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})