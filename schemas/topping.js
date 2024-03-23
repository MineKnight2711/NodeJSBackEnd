var mongoose = require("mongoose");
const toppingSchema = new mongoose.Schema({
    topping_name: { type: String, required: true },
    toppingPrice: { type: Number, required: true },
    drink: { type: Schema.Types.ObjectId, ref: 'drink', required: true },
    isDeleted: {type: Boolean,default: false}
}, { timestamps: true,versionKey:false });
drinkSchema.virtual('drink',{ref:'drink',localField:"_id",foreignField:"topping"})
drinkSchema.set("toJSON",{virtuals:true})
drinkSchema.set("toObject",{virtuals:true})
module.exports = new mongoose.model('topping', toppingSchema);