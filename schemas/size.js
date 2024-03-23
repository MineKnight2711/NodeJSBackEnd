var mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
    sizeName: { type: String, required: true },
    isDelete:{ type: String, default: false }
}, { timestamps: true,versionKey:false });
module.exports = new mongoose.model('size', sizeSchema);