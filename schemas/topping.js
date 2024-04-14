var mongoose = require("mongoose");
const toppingSchema = new mongoose.Schema({
    toppingName: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    // drink: { type: mongoose.Types.ObjectId, ref: 'drink'},
    isDeleted: {type: Boolean,default: false}
}, { timestamps: true,versionKey:false });
toppingSchema.virtual('drink_toppings',{ref:'drink',localField:"_id",foreignField:"topping"})
//Mở dòng dưới ra thì sẽ có 2 khóa khi get topping
toppingSchema.set("toJSON",{virtuals:true})
toppingSchema.set("toObject",{virtuals:true})
module.exports = new mongoose.model('topping', toppingSchema);