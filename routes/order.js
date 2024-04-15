var express = require('express');
var router = express.Router();
var orderModel = require('../schemas/order')
var ResHelper = require('../helper/ResponseHelper');
var checkLogin = require('../middlewares/checklogin')

router.get('/:userId', async function (req, res, next) {
  let order = await orderModel.find({user:req.params.userId}).exec();
  ResHelper.RenderRes(res, true, order)
});

router.get('/id/:id', async function (req, res, next) {
  try {
    let order = await orderModel.find({ _id: req.params.id }).exec();
    ResHelper.RenderRes(res, true, order)
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
})

router.post('/',checkLogin, async function (req, res, next) {
    try {
      const { user, order_date, total_amount, order_items } = req.body;
  
      const newOrder = new orderModel({
        user,
        order_date,
        total_amount,
        order_items,
      });
  
      await newOrder.save();
  
      ResHelper.RenderRes(res, true, newOrder);
    } catch (error) {
      ResHelper.RenderRes(res, false, error);
    }
  });


  ////Delete

  router.delete('/:id', async function (req, res, next) {
    try {
      let order = await orderModel.findByIdAndUpdate
        (req.params.id, {
          isDelete: true
        }, {
          new: true
        }).exec()
      ResHelper.RenderRes(res, true, order);
    } catch (error) {
      ResHelper.RenderRes(res, false, error)
    }
  });
module.exports = router;