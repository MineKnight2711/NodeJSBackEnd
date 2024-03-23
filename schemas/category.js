var mongoose = require("mongoose");
var categorySchema = new mongoose.Schema({
    categoryName: 
    {
        type: String,
        required: true,
        unique: true
    },
    imageUrl:
    {
        type: String,
        required: false,
        unique: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true,versionKey:false })
categorySchema.virtual('withDrink',{ref:'drink',localField:"_id",foreignField:"category"})
categorySchema.set("toJSON",{virtuals:true})
categorySchema.set("toObject",{virtuals:true})
module.exports = new mongoose.model('category', categorySchema);