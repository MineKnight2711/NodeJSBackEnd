var express = require('express');
var router = express.Router();
var cartModel = require('../schemas/cart')
var ResHelper = require('../helper/ResponseHelper');
router.get('/', async function (req, res, next) {
    let cart_items = await cartModel.find({}).exec();
    ResHelper.RenderRes(res, true, cart_items)
});
router.get('/:id', async function (req, res, next) {
    try {
        let cart_item = await cartModel.find({ user: req.params.id })
                                    .populate('user', 'username email')
                                    .populate('drink', 'drinkName imageUrl price')
                                    .populate('size', 'sizeName price')
                                    .populate('toppings', 'toppingName imageUrl')
                                    .lean()
                                    .exec();
        ResHelper.RenderRes(res, true, cart_item)
    } catch (error) {
        ResHelper.RenderRes(res, false, error)
    }
});
router.post('/add-to-cart', async function (req, res, next) {
    try {
      const { user, drink, size, is_hot, toppings, quantity } = req.body;
  
      // Check if the cart item already exists
      const existingCartItem = await cartModel.findOne({
        user,
        drink,
        size,
        toppings,
      });
  
      if (existingCartItem) {
        // If the cart item exists, update the quantity
        existingCartItem.quantity += quantity;
        const updatedCartItem = await existingCartItem.save();
        ResHelper.RenderRes(res, true, updatedCartItem);
      } else {
        // If the cart item doesn't exist, create a new one
        const newCartItem = new cartModel({
          user,
          drink,
          size,
          is_hot: is_hot || false,
          toppings: Array.isArray(toppings) ? toppings : [toppings],
          quantity,
        });
  
        await newCartItem.save();
        ResHelper.RenderRes(res, true, newCartItem);
      }
    } catch (error) {
      ResHelper.RenderRes(res, false, error);
    }
  });
router.put('/update-cart-item/:cartItemId', async function (req, res, next) {
    try {
      const { quantity } = req.body;
      const { cartItemId } = req.params;
  
      // Find the cart item by ID
      const cartItem = await cartModel.findById(cartItemId);
  
      if (!cartItem) {
        ResHelper.RenderRes(res, false, 'Cart item not found');
      }
  
      // Update the quantity
      cartItem.quantity = quantity;
  
      // Save the updated cart item
      const updatedCartItem = await cartItem.save();
  
      ResHelper.RenderRes(res, true, updatedCartItem);
    } catch (error) {
      ResHelper.RenderRes(res, false, error);
    }
});
router.delete('/delete-cart-item/:id', async function (req, res, next) {
    try {
        
      // Find the cart item by ID
      const cartItem = await cartModel.findByIdAndDelete(req.params.id);
      
      if (!cartItem) {
        ResHelper.RenderRes(res, false, 'Cart item not found');
      }
  
      ResHelper.RenderRes(res, true, 'Cart item deleted successfully');
    } catch (error) {
      ResHelper.RenderRes(res, false, error);
    }
  });
module.exports= router