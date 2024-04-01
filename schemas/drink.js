var mongoose = require("mongoose");

const drinkSchema = new mongoose.Schema({
    drinkName: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Types.ObjectId, ref: 'category', required: true },
    toppings: [{ type: mongoose.Types.ObjectId, ref: 'topping' }],
    isDelete: {type:String,default:false}
  },{ timestamps: true,versionKey:false });

// drinkSchema.virtual('drink_category',{ref:'category',localField:"_id",foreignField:"drink"})
// drinkSchema.set("toJSON",{virtuals:true})
// drinkSchema.set("toObject",{virtuals:true})
module.exports = new mongoose.model('drink', drinkSchema);