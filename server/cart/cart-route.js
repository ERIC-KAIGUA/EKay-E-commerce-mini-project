import { Router } from "express";
import mongoose from "mongoose";
import { Cart } from "./cart-model.js";
import {User} from '../usermodel/userschema.js';
import { isAuthenticated } from "../middleware/auth-middlware.js";
import { Products } from "../models/schema/products.js";


const router = Router();
//getting the cart
router.get('/cart', isAuthenticated, async(req,res)=>{
    const cart = await Cart.findOne({userid:req.session.user._id})
    .populate("items.productid")
    if(!cart) return res.send({ items: [] });
    return res.send(cart)
})
// adding items into the cart!
router.post('/add-items', isAuthenticated, async (req, res) => {
    console.log("---------------------------------------------------");
    console.log("POST /add-items request received.");

    const userId = req.session.user._id;
    const { body: { productid, quantity } } = req;

    console.log("1. User ID from session:", userId);
    console.log("2. Product ID from request body:", productid);
    console.log("3. Quantity from request body:", quantity);

    // --- Input Validation ---
    if (!productid) {
        console.log("ERROR: Product ID is required (Validation 1). Sending 400 response.");
        return res.status(400).send({ msg: "Product ID is required." });
    }

    // Corrected `res.send().status()` to `res.status().send()`
    if (!mongoose.Types.ObjectId.isValid(productid)) {
        console.log("ERROR: Invalid Product ID format (Validation 2). Sending 401 response.");
        return res.status(401).send({ msg: "Invalid Product ID format." });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
        console.log("ERROR: Invalid quantity (Validation 3). Sending 400 response.");
        return res.status(400).send({ msg: "Quantity must be a positive number." });
    }
    console.log("4. Initial input validations passed.");

    // --- Product Existence Check ---
    try {
        // Ensure 'Products' model is correctly imported/defined, e.g., const Products = mongoose.model('Product');
        console.log("5. Checking if product exists in database for ID:", productid);
        const Product = mongoose.model('Products'); // Assuming your Product model is named 'Product'
        const productExists = await Product.findById(productid);

        if (!productExists) {
            console.log("ERROR: Product with this ID does not exist. Sending 404 response.");
            return res.status(404).send({ msg: "Product with this ID does not exist." });
        }
        console.log("6. Product found in database:", productExists._id);
    } catch (dbError) {
        console.error("CRITICAL ERROR: Database error while checking product existence:", dbError);
        return res.status(500).send({ msg: "Server error while validating product ID." });
    }

    // --- Cart Logic ---
    try {
        console.log("7. Attempting to find cart for user ID:", userId);
        let cart = await Cart.findOne({ userid: userId });
        console.log("8. Cart found:", cart ? cart._id : "None existing, creating new.");

        if (cart) {
            console.log("9. Cart exists. Checking for existing item...");
            // Use .toString() for consistent comparison with string productid
            const existingItem = cart.items.find(item => item.productid && item.productid.toString() === productid);

            if (existingItem) {
                existingItem.quantity += qty;
                console.log("10. Existing item found. Quantity updated.");
            } else {
                // Ensure 'productid' is correctly spelled here (lowercase 'id' for consistency)
                cart.items.push({ productid: productid, quantity: qty });
                console.log("10. New item added to existing cart.");
            }
            await cart.save();
            console.log("11. Existing cart saved successfully. Sending 200 response.");
            return res.status(200).send(cart); // <<-- IMPORTANT: Always send a response here
        } else {
            console.log("9. No cart found. Creating a new cart...");
            const newCart = new Cart({
                userid: userId,
                // Ensure 'productid' is correctly spelled here (lowercase 'id' for consistency)
                items: [{ productid: productid, quantity: qty }]
            });
            await newCart.save();
            console.log("11. New cart created and saved successfully. Sending 201 response.");
            return res.status(201).send(newCart); // <<-- IMPORTANT: Always send a response here
        }
    } catch (err) {
        console.error(`CRITICAL ERROR in cart logic: ${err}`); // Use console.error for actual errors
        return res.status(500).send({ msg: "Server error while managing cart." }); // <<-- IMPORTANT: Always send a response here on error
    }
    // This line should ideally never be reached if all paths return a response
    console.log("WARNING: End of route reached without sending a response!");
    console.log("---------------------------------------------------");
});
//removing items from cart
router.delete('/cart/:productid', isAuthenticated, async(req,res)=>{
  try{
    const userId =req.session.user._id;
    const removeItem = req.params.productid;

    if(!mongoose.Types.ObjectId.isValid(removeItem)){
      return res.send({msg:"Invalid Product ID"})
    }
    const cart = await Cart.findOne({userid:userId});
   if(!cart){
    return res.send({msg:"Cart not Found for this User"})
    }

    const InitialitemCount = cart.items.length;
    cart.items = cart.items.filter(item=>{if(item && item.productid){return item.productid.toString()!== removeItem;}return false });
     if(cart.items.length === InitialitemCount) {
      return res.status(404).send({ msg: 'Product not found in cart.'})}
      await cart.save()
      res.status(200).send({ msg: 'Item removed from cart successfully.', cart: cart });
  }catch(err){
    console.log(`ERR:${err}`)
  }
   
})
export default router