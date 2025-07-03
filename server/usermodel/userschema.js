import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:mongoose.Schema.Types.String,
        required: true,
        unique:true
    },
    email:{
        type:mongoose.Schema.Types.String,
        required:true,
        unique:true
    },
    password:{
        type: mongoose.Schema.Types.String,
        required:true,
        unique:true
    },
    isAdmin:{
        type:mongoose.Schema.Types.Boolean,
        default:false
    }

})
export const User = mongoose.model('User',userSchema)