var mongoose = require("mongoose");
const drinkSchema = new mongoose.Schema({
    drink_name: { type: String, required: true },
    description: { type: String },
    base_price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    toppings: [{ type: Schema.Types.ObjectId, ref: 'topping' }],
    isDelete: {type:String,default:false}
  },{ timestamps: true,versionKey:false });
drinkSchema.virtual('toppings',{ref:'topping',localField:"_id",foreignField:"drink"})
drinkSchema.virtual('category',{ref:'category',localField:"_id",foreignField:"drink"})
drinkSchema.set("toJSON",{virtuals:true})
drinkSchema.set("toObject",{virtuals:true})
module.exports = new mongoose.model('drink', drinkSchema);