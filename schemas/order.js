var mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    // customer_id: { type: Number, required: true },
    order_date: { type: Date, required: true },
    total_amount: { type: Number, required: true },
    order_items: [
        {
            cart_item: { type: Schema.Types.ObjectId, ref: 'cart', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    isDelete:{ type: String, default: false }
}, { timestamps: true,versionKey:false });
drinkSchema.virtual('cart_items',{ref:'cart',localField:"_id",foreignField:"order"})
// drinkSchema.virtual('category',{ref:'category',localField:"_id",foreignField:"drink"})
drinkSchema.set("toJSON",{virtuals:true})
drinkSchema.set("toObject",{virtuals:true})
module.exports = new mongoose.model('order', orderSchema);
  