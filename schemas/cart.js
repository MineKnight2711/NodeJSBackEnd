var mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    drink: { type: Schema.Types.ObjectId, ref: 'drink', required: true },
    size: { type: Schema.Types.ObjectId, ref: 'size', required: true },
    is_hot: { type: Boolean, default: false },
    toppings: [{ type: Schema.Types.ObjectId, ref: 'topping' }],
    quantity:{ type: Number, require:true},
    isDelete:{ type: String, default: false }
  },{ timestamps: true,versionKey:false });
cartSchema.virtual('drink',{ref:'drink',localField:"_id",foreignField:"cart"})
cartSchema.virtual('size',{ref:'size',localField:"_id",foreignField:"cart"})
cartSchema.virtual('toppings',{ref:'topping',localField:"_id",foreignField:"cart"})
cartSchema.set("toJSON",{virtuals:true})
cartSchema.set("toObject",{virtuals:true})
module.exports = new mongoose.model('cart', cartSchema);