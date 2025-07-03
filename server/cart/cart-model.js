import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[{
         productid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Products'
         },
         quantity:{
            type:Number,
            default:1
         }
    }
    ]
},{timestamps:true})

export const Cart = mongoose.model('Cart',cartSchema)