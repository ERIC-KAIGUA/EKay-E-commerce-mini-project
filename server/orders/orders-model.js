import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[{
        productid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Products',
            required:true
        },
        quantity:{
            type:Number,
            default:1,
            required:true
        }
     }],
     totalPrice: Number,

     paymentStatus:{
        type:String,
       enum:['pending','paid','failed'],
       default:'pending'
     }
},{timestamps:true})

export const Order = mongoose.model('Order', orderSchema)