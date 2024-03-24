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
module.exports = new mongoose.model('category', categorySchema);