var mongoose = require("mongoose");
const sugarLevelSchema = new mongoose.Schema({
    sugar_level: { type: String, required: true },
    isDelete:{ type: String, default: false }
}, { timestamps: true,versionKey:false });
module.exports = new mongoose.model('sugar_lever', sugarLevelSchema,"sugar_lever");