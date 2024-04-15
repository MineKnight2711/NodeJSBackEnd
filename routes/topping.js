var express = require('express');
var router = express.Router();
var toppingModel = require('../schemas/topping')
var ResHelper = require('../helper/ResponseHelper');
const { query } = require('express');
var uploadFile = require('../services/firebase');
const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage()
})
router.get('/', async function (req, res, next) {
  
  let categories = await toppingModel.find({}).exec();
    // .populate({path:'author',select:"name"})
    // .lean()
    // .limit(limit)
    // .skip((page - 1) * limit)
    // .sort(sortQuery)
  ResHelper.RenderRes(res, true, categories)
});
router.get('/:id', async function (req, res, next) {
  try {
    let book = await toppingModel.find({ _id: req.params.id }).exec();
    ResHelper.RenderRes(res, true, book)
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});
router.get('/get-by-drink/:id', async function (req, res, next) {
  try {
    let book = await toppingModel.find({ _id: req.params.id }).exec();
    ResHelper.RenderRes(res, true, book)
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});
router.post('/', upload.single('file'), async (req, res) => {
  try {
      // Check if a file was uploaded
      if (!req.file) {
        ResHelper.RenderRes(res, false, error)
      }
  
      // Get the file buffer, save path, and object name from the request
      const fileBuffer = req.file.buffer;
      const savePath = 'toppingsimage/';
      const objectName = req.file.originalname;
  
      // Call the uploadImage function
      const downloadUrl = await uploadFile.uploadImage(fileBuffer, savePath, objectName);
      try {
          var newTooping = new toppingModel({
            toppingName: req.body.toppingName,
            imageUrl:downloadUrl,
            price: req.body.price,
              
          })
          await newTooping.save();
          ResHelper.RenderRes(res, true, newTooping)
      } catch (error) {
          ResHelper.RenderRes(res, false, error)
      }
  } catch (error) {
      console.error('Error uploading image:', error);
      ResHelper.RenderRes(res,false,error)
  }
  });
router.put('/:id', async function (req, res, next) {
  try {
    let topping = await toppingModel.findByIdAndUpdate
      (req.params.id, req.body, {
        new: true
      }).exec()
    ResHelper.RenderRes(res, true, topping);
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});
module.exports = router;