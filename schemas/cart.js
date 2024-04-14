var mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    user:{ type: mongoose.Types.ObjectId, ref: 'user', required: true },
    drink: { type: mongoose.Types.ObjectId, ref: 'drink', required: true },
    size: { type: mongoose.Types.ObjectId, ref: 'size', required: true },
    is_hot: { type: Boolean, default: false },
    toppings: [{ type: mongoose.Types.ObjectId, ref: 'topping' }],
    quantity:{ type: Number, require:true},
    isDelete:{ type: String, default: false }
  },{ timestamps: true,versionKey:false });
cartSchema.virtual('user_cart',{ref:'user',localField:"_id",foreignField:"cart"})
cartSchema.virtual('item_drink',{ref:'drink',localField:"_id",foreignField:"cart"})
cartSchema.virtual('item_size',{ref:'size',localField:"_id",foreignField:"cart"})
cartSchema.virtual('item_toppings',{ref:'topping',localField:"_id",foreignField:"cart"})
cartSchema.set("toJSON",{virtuals:true})
cartSchema.set("toObject",{virtuals:true})
module.exports = new mongoose.model('cart', cartSchema);