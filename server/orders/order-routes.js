import Router from 'express';
import mongoose from 'mongoose';
import { Order } from './orders-model.js';
import { Cart } from '../cart/cart-model.js';
import { isAuthenticated } from '../middleware/auth-middlware.js';


const router = Router();
//view user orders
router.get('/orders', isAuthenticated, async(req,res)=>{
    const orders = await Order.find({userid:req.session.user._id}).populate('items.productid');
    return res.send(orders)
})
//place orders
router.post('/place-orders', isAuthenticated, async(req,res)=>{
    try{ 
       const userId = req.session.user._id;
       const cart = await Cart.findOne({userid:userId}).populate('items.productid');
       if(!cart || cart.items.length === 0) return res.send("Cart is Empty").status(400);

       const totalPrice = cart.items.reduce((sum,item)=>{
        if (item.productid && typeof item.productid.price === 'number') {
                return sum + item.productid.price * item.quantity;
            }else{
                console.warn(`Skipping malformed item in cart for order creation: Product ID ${item.productid ? item.productid._id : 'N/A'}, Quantity: ${item.quantity}`);
                return sum;
        }
     },0);
           if(totalPrice < 0){
            console.error(`Calculated total price is negative for user ${userId}: ${totalPrice}`);
            return res.status(500).send({ msg: "Error calculating total price for order." });
        }
         const order = new Order({
            userid: cart.userid, 
            items: cart.items.map(i => {
                if (i.productid && i.productid._id) {
                    return {
                        productid: i.productid._id, 
                        quantity: i.quantity
                    };
           }else{
            console.warn(`Skipping item with missing productid for order mapping: ${JSON.stringify(i)}`);
                    return null; 
           }
            }).filter(item => item !== null), 
            totalPrice: totalPrice 
            });
             if (order.items.length === 0 && totalPrice === 0 && cart.items.length > 0) {
            return res.status(400).send({ msg: "Could not create order: All cart items were malformed or invalid." });
        }
         await order.save();
        console.log(`Order placed successfully for user ${userId}. Order ID: ${order._id}`);

        await Cart.findOneAndDelete({ userid: cart.userid });
        console.log(`Cart deleted for user ${userId}.`);

        return res.status(200).send({ msg: 'Order Placed Successfully!', orderId: order._id });
    }catch(err){
        console.error("Error placing order:", err);
        res.status(500).send({ msg: "Server error while placing order." });
    }
})
router.delete('/orders/:orderId', isAuthenticated, async (req, res) => {
    console.log("---------------------------------------------------");
    console.log("DELETE /orders/:orderId request received.");
    try {
        const userId = req.session.user._id; // Get the authenticated user's ID
        const orderIdToDelete = req.params.orderId; // Get the order ID from URL parameters

        console.log("1. User ID from session:", userId);
        console.log("2. Order ID from URL parameter:", orderIdToDelete);

        // 3. Validate if the provided orderId is a valid MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(orderIdToDelete)) {
            console.log("ERROR: Invalid Order ID format. Sending 400 response.");
            return res.status(400).send({ msg: "Invalid Order ID format." });
        }
        console.log("4. Order ID format is valid.");

        // 5. Attempt to find and delete the order.
        // Crucially, we query by both _id and userid to ensure a user can only delete their own orders.
        console.log(`5. Attempting to find and delete order (ID: ${orderIdToDelete}) for user (ID: ${userId}).`);
        const deletedOrder = await Order.findOneAndDelete({
            _id: orderIdToDelete,
            userid: userId // Ensure the order belongs to the authenticated user
        });

        // 6. Check if an order was actually found and deleted
        if (!deletedOrder) {
            console.log("ERROR: Order not found for this user, or already deleted. Sending 404 response.");
            return res.status(404).send({ msg: "Order not found or already deleted." });
        }

        console.log(`7. Order successfully deleted. Order ID: ${deletedOrder._id}`);
        // 8. Send a success response
        return res.status(200).send({ msg: 'Order deleted successfully!', orderId: deletedOrder._id });

    } catch (error) {
        console.error("CRITICAL ERROR in DELETE /orders/:orderId route:", error);
        // 9. Send an appropriate error response for server-side issues
        return res.status(500).send({ msg: "Server error while deleting order." });
    } finally {
        console.log("---------------------------------------------------");
    }
});



export default router;