var express = require('express');
var router = express.Router();
var categoryModel = require('../schemas/category')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');

router.post('/', async function (req, res, next) {
    try {
      var newbook = new categoryModel({
        categoryName: req.body.categoryName,
        imageUrl:req.body.imageUrl,
      })
      await newbook.save();
      ResHelper.RenderRes(res, true, newbook)
    } catch (error) {
      ResHelper.RenderRes(res, false, error)
    }
  });
module.exports = router;