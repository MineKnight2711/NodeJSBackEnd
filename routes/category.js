var express = require('express');
var router = express.Router();
var categoryModel = require('../schemas/category')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');

router.get('/', async function (req, res, next) {
  
  let categories = await categoryModel.find({}).exec();
    // .populate({path:'author',select:"name"})
    // .lean()
    // .limit(limit)
    // .skip((page - 1) * limit)
    // .sort(sortQuery)
  ResHelper.RenderRes(res, true, categories)
});
router.get('/:id', async function (req, res, next) {
  try {
    let book = await bookModel.find({ _id: req.params.id }).exec();
    ResHelper.RenderRes(res, true, book)
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});
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
router.put('/:id', async function (req, res, next) {
  try {
    let category = await categoryModel.findByIdAndUpdate
      (req.params.id, req.body, {
        new: true
      }).exec()
    ResHelper.RenderRes(res, true, book);
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});
module.exports = router;