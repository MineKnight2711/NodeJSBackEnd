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
router.get('/', async function (req, res, next) {
  
    let drinks = await drinkModel
        .find({})
        .populate('category', 'categoryName imageUrl')
        .populate('toppings', 'toppingName imageUrl price')
        .lean()
        .exec();
    ResHelper.RenderRes(res, true, drinks)
  });
router.get('/search', async function (req, res, next) {
    const drinkName = req.query.drinkName || '';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const drinks = await drinkModel
        .find({
            drinkName: { $regex: new RegExp(drinkName, 'i') },
            isDelete: false, 
        })
        .populate('category', 'categoryName imageUrl')
        .populate('toppings', 'toppingName imageUrl price')
        .lean()
        .sort({ price: sortOrder })
        .exec();
    ResHelper.RenderRes(res, true, drinks);
});

router.get('/:id', async function (req, res, next) {

    let drinks = await drinkModel
        .findOne({_id:req.params.id})
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
        let toppings=[];
        if(req.body.toppings){
            toppings= Array.isArray(req.body.toppings) ? req.body.toppings : [req.body.toppings];
            const existingToppings = await toppingModel.find({ _id: { $in: toppings } });

            if (existingToppings.length !== toppings.length) {
                ResHelper.RenderRes(res, false, "SomeToppingNotFound")
            }    
        }
        
        var newDrink = new drinkModel({
            drinkName: req.body.drinkName,
            description:req.body.description,
            price:req.body.price,
            category: req.body.categoryId,
            imageUrl:downloadUrl,
            toppings:toppings,
        })
        await newDrink.save();
        ResHelper.RenderRes(res, true, newDrink)
    } catch (error) {
        ResHelper.RenderRes(res, false, error)
    }
} catch (error) {
    console.error('Error uploading image:', error);
    ResHelper.RenderRes(res,false,error)
}
});
module.exports= router