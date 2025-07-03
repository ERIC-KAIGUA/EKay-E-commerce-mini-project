import Router from 'express';
import { Products } from '../models/schema/products.js';


const router = Router();

//getting all products
router.get('/api/products',async(req,res)=>{
  const findProduct = await Products.find()
  res.send(findProduct)
})
router.post('/api/find-product', async(req,res)=>{
   const{body:{productName}}=req;
   const product = await Products.findOne({productName})
   if(!product) return res.send({msg:"Product not found"})
    return res.send(product)
})
router.post('/api/add-products',async(req,res)=>{
  
  const{body:{productName,price,quantity}}=req;

  try{
    const isExisting = await Products.findOne({productName})
      if(isExisting) return res.send(req.params.Products)

     const product = new Products({
      productName,
      price,
      quantity
     })
     await product.save()
     return res.send({msg:"Item Saved"})
   }
    catch(err){
         console.log(`ERR:${err}`)
    }
})
export default router