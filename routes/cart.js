var express = require('express');
var router = express.Router();
var cartModel = require('../schemas/cart')
var ResHelper = require('../helper/ResponseHelper');
const cart = require('../schemas/cart');
router.get('/', async function (req, res, next) {
    let cart_items = await cartModel.find({}).exec();
    ResHelper.RenderRes(res, true, cart_items)
});
router.get('/:id', async function (req, res, next) {
    try {
        let cart_item = await cartModel.find({ user: req.params.id ,isDelete:false})
                                    .populate('drink', 'drinkName imageUrl price ')
                                    .populate('size', 'sizeName price')
                                    .populate('toppings', 'toppingName imageUrl price')
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
        ResHelper.RenderRes(res, true, "Thêm vào giỏ hàng thành công");
      }
    } catch (error) {
      ResHelper.RenderRes(res, false, error);
    }
  });
  router.put('/update-cart-item/:cartItemId', async function (req, res, next) {
    try {
      const { quantity, toppings, size } = req.body;
      const { cartItemId } = req.params;
  
      // Find the cart item by ID
      const cartItem = await cartModel.findById(cartItemId).exec();
  
      if (!cartItem) {
        ResHelper.RenderRes(res, false, 'Cart item not found');
        return;
      }
      // Update the quantity
      if (quantity) {
        cartItem.quantity = quantity;
      }
  
      // Update the toppings
      if (toppings) {
        cartItem.toppings = toppings;
      }
  
      // Update the size
      if (size) {
        cartItem.size = size;
      }
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
      const cartItem = await cartModel.findOne({_id:req.params.id});
      
      if (!cartItem) {
        ResHelper.RenderRes(res, false, 'Cart item not found');
      }
      cartItem.isDelete=true;
      await cartItem.save();
      ResHelper.RenderRes(res, true, 'Cart item deleted successfully');
    } catch (error) {
      ResHelper.RenderRes(res, false, error);
    }
  });

  router.delete('/delete-multiple-item', async function (req, res, next) {
    try {
        // Extract the array of IDs from the request body
        const { ids } = req.body;

        // Check if IDs array is provided
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return ResHelper.RenderRes(res, false, 'Id truyền vào không hợp lệ');
        }
        const cartItems = await cartModel.find({ _id: { $in: ids } });

        if (!cartItems || cartItems.length === 0) {
            return ResHelper.RenderRes(res, false, 'Không tìm thấy item');
        }

        for (const cartItem of cartItems) {
            cartItem.isDelete = true;
            await cartItem.save();
        }
        ResHelper.RenderRes(res, true, 'Xoá các sản phẩm thành công');
    } catch (error) {
        // Handle errors
        console.error(error);
        ResHelper.RenderRes(res, false, error.message || 'An error occurred');
    }
});
module.exports= router