import { Router } from "express";
import mongoose from "mongoose";
import {User} from '../usermodel/userschema.js'
import bcrypt from 'bcrypt';



const router = Router();
const saltRounds = 10;


router.post('/api/register', async(req,res)=>{
    const{body:{name,email,password}} = req;
    try{ 
        const isExisting = await User.findOne({name})
         if(isExisting) return res.send({msg:"User already Exists"});

         const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            name,
            email,
            password:hashedPassword
        })
       await user.save()
       return res.send({msg:"User has been added successfully!"}).status(200)
    }catch(err){
        console.log(`ERR:${err}`)
    }
    
})
router.post('/api/login', async (req, res) => {
    const { name, password } = req.body; 

    try {
        const loginUser = await User.findOne({ name: name }); 

        if (!loginUser) {
          
            return res.status(401).json({ message: "Invalid Credentials" });
        }

       
        const isPasswordValid = await bcrypt.compare(password, loginUser.password);

        if (!isPasswordValid) {
           
            return res.status(401).json({ message: "Invalid Credentials" });
        }

       
        req.session.userId = loginUser._id;      
        req.session.username = loginUser.name;    

        
        return res.status(200).json({ message: "Login Successful", user: { id: loginUser._id, username: loginUser.name } });

    } catch (err) {
        
        console.error(`Login error: ${err}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/api/protected',(req,res)=>{
    if(req.session.user){
        res.status(200).json({
            message:`Welcome, ${req.session.name}`,
            session:req.session
        })
    }else{
        res.status(401).json({msg:"Unauthorized. Please Log in"})
    }
})
router.post('/api/logout', (req,res)=>{
    req.session.destroy(err => {
        if(err) return res.status(500).json({msg:'Logout failed'});
        res.clearCookie('connect.sid');
        res.json("Logout was successful");
    })
})
export default router