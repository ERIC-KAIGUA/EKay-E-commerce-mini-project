import { Router } from "express";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {User} from '../usermodel/userschema.js';

const router = Router();
const saltRounds =10;


router.post('/api/admin-register',async (req,res)=>{
    const{body:{name,email,password,isAdmin}} = req;
    try{
        const findAdmin = await User.findOne({name})
        if(findAdmin) return res.send({msg:"User already exists"})
         
            const hashedPassword = await bcrypt.hash(password,saltRounds);
            const newAdmin = new User({
               name,
               email,
               password: hashedPassword,
               isAdmin
        })
       await newAdmin.save()
       return res.send({msg:"Admin has been added successfully!"}).status(200)  
    }catch(err){
        console.log(`ERR: ${err}`)
    }
})
export default router