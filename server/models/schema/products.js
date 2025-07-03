import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName:{ 
        type:mongoose.Schema.Types.String,
        required:true
    },
    price:{
        type:mongoose.Schema.Types.Number,
        required:true
    },
    quantity:{
        type:mongoose.Schema.Types.Number,
        required:true
    }
})
export const Products = mongoose.model('Products',productSchema)