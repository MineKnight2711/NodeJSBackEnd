var express = require('express');
var router = express.Router();
var drinkModel = require('../schemas/drink');
var toppingModel = require('../schemas/topping');
var ResHelper = require('../helper/ResponseHelper');
var uploadFile = require('../services/firebase');
const multer = require('multer')
const upload = multer({
    storage: multer.memoryStorage()
})


//// GET Method


router.get('/', async function (req, res, next) {
  
    let drinks = await drinkModel
        .find({})
        .populate('category', 'categoryName imageUrl')
        .populate('toppings', 'toppingName imageUrl price')
        .lean()
        .exec();
    ResHelper.RenderRes(res, true, drinks)
  });
router.get('/get-by-category/:id', async function (req, res, next) {

    let drinks = await drinkModel
        .find({category:req.params.id})
        .populate('category', 'categoryName imageUrl')
        .populate('toppings', 'toppingName imageUrl price')
        .lean()
        .exec();
    ResHelper.RenderRes(res, true, drinks)
});

router.get('/search', async function (req, res, next) {
    const exclude = ["sort", "page", "limit"];
    const stringArray = ["name"];
    const queries = {};
  
    for (const [key, value] of Object.entries(req.query)) {
      if (!exclude.includes(key)) {
        if (stringArray.includes(key)) {
          queries[key] = new RegExp(value.replace(',', "|"), 'i');
        }
      }
    }
  
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const page = req.query.page ? parseInt(req.query.page) : 1;
  
    const sortQuery = {};
    if (req.query.sort) {
      if (req.query.sort.startsWith('-')) {
        const field = req.query.sort.substring(1);
        sortQuery[field] = -1;
      } else {
        sortQuery[req.query.sort] = 1;
      }
    }
  
    try {
      const drinks = await drinkModel.find(queries)
        .populate({ path: 'name', select: "name" }).lean()
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sortQuery)
        .lean()
        .exec();
  
      ResHelper.RenderRes(res, true, drinks);
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      ResHelper.RenderRes(res, false, null, "An error occurred");
    }
});

  //// Get By Id
router.get('/:id', async(req, res) => {
  try {
    let drink = await drinkModel.find({ _id: req.params.id }).exec();
    ResHelper.RenderRes(res, true, drink)
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
})


router.post('/', upload.single('file'), async (req, res) => {
try {
    // Check if a file was uploaded
    if (!req.file) {
    return res.status(400).send('Error: No file uploaded');
    }

    // Get the file buffer, save path, and object name from the request
    const fileBuffer = req.file.buffer;
    const savePath = 'testnode/';
    const objectName = req.file.originalname;

    // Call the uploadImage function
    const downloadUrl = await uploadFile.uploadImage(fileBuffer, savePath, objectName);
    try {
        const toppings = Array.isArray(req.body.toppings) ? req.body.toppings : [req.body.toppings];
        const existingToppings = await toppingModel.find({ _id: { $in: toppings } });

        if (existingToppings.length !== toppings.length) {
            ResHelper.RenderRes(res, false, "SomeToppingNotFound")
        }    

        var newbook = new drinkModel({
            drinkName: req.body.drinkName,
            description:req.body.description,
            price:req.body.price,
            category: req.body.categoryId,
            imageUrl:downloadUrl,
            toppings:Array.isArray(req.body.toppings) ? req.body.toppings : [req.body.toppings],
        })
        await newbook.save();
        ResHelper.RenderRes(res, true, newbook)
    } catch (error) {
        ResHelper.RenderRes(res, false, error)
    }
} catch (error) {
    console.error('Error uploading image:', error);
    ResHelper.RenderRes(res,false,error)
}
});

////Put method
router.put('/:id', upload.single('file'), async(req, res, next) => {
  try {
    let drink = await drinkModel.findByIdAndUpdate
                (req.params.id, req.body, {
                  new: true
                }).exec()    
    ResHelper.RenderRes(res, true, drink)
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});

///Delete Method
router.delete('/:id', async function (req, res, next) {
  try {
    let drink = await drinkModel.findByIdAndUpdate
      (req.params.id, {
        isDelete: true
      }, {
        new: true
      }).exec()
      drink.save()
    ResHelper.RenderRes(res, true, drink);
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});

module.exports= router