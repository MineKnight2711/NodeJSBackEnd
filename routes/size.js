var express = require('express');
var router = express.Router();
var sizeModel = require('../schemas/size')
var ResHelper = require('../helper/ResponseHelper');


router.get('/', async function (req, res, next) {
  let sizes = await sizeModel.find({}).exec();
  ResHelper.RenderRes(res, true, sizes)
});

router.get('/:id', async function (req, res, next) {
  try {
    let size = await sizeModel.find({ _id: req.params.id }).exec();
    ResHelper.RenderRes(res, true, size)
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
})
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

////Put method
router.put('/:id', async(req, res, next) => {
  try {
    let size = await sizeModel.findByIdAndUpdate
                (req.params.id, req.body, {
                  new: true
                }).exec()    
    ResHelper.RenderRes(res, true, size)
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});

////Put method
router.put('/restore/:id', async(req, res, next) => {
  try {
    let size = await sizeModel.findByIdAndUpdate
      (req.params.id, {
        isDelete: false
      }, {
        new: true
      }).exec()
    ResHelper.RenderRes(res, true, size);
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});

///Delete
router.delete('/:id', async function (req, res, next) {
  try {
    let size = await sizeModel.findByIdAndUpdate
      (req.params.id, {
        isDelete: true
      }, {
        new: true
      }).exec()
    ResHelper.RenderRes(res, true, size);
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});
module.exports = router;