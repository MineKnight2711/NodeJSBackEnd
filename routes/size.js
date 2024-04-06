var express = require('express');
var router = express.Router();
var sizeModel = require('../schemas/size')
var ResHelper = require('../helper/ResponseHelper');


router.get('/', async function (req, res, next) {
  let sizes = await sizeModel.find({}).exec();
  ResHelper.RenderRes(res, true, sizes)
});

router.post('/', async function (req, res, next) {
  try {
    var newSize = new sizeModel({
        sizeName: req.body.sizeName,
        price: req.body.price,
    })
    await newSize.save();
    ResHelper.RenderRes(res, true, newSize)
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});
module.exports = router;