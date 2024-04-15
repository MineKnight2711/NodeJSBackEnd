var mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    order_date: { type: Date, required: true },
    order_items: [
        {
            cart_item: { type: mongoose.Types.ObjectId, ref: 'cart', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    isDelete:{ type: String, default: false }
}, { timestamps: true,versionKey:false });
orderSchema.virtual('cart_items',{ref:'cart',localField:"_id",foreignField:"order"})

orderSchema.set("toJSON",{virtuals:true})
orderSchema.set("toObject",{virtuals:true})
module.exports = new mongoose.model('order', orderSchema);
  