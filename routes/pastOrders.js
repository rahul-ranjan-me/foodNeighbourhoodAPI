const express = require("express");
const router = express.Router();
const PastOrders = require("../models/pastOrders");
const Verify = require("./verify");
const errorManager = require("./errorManager");

router
  .route("/:username")
  .get(Verify.verifyOrdinaryUser, async (req, res, next) => {
    const pastOrders = await PastOrders.find({
      username: req.params.username,
    }).catch((err) => {
      errorManager(res, err);
    });
    res.json(pastOrders);
  })
  .post(Verify.verifyOrdinaryUser, async (req, res, next) => {
    const orders = await PastOrders.find({
      username: req.params.username,
    }).catch((err) => {
      errorManager(res, err);
    });
    if (orders.length > 0) {
      let pastOrdersTemp = orders[0].pastOrders;
      pastOrdersTemp.push(req.body);
      const toUpdate = { pastOrders: pastOrdersTemp };
      const updatedOrders = await PastOrders.findOneAndUpdate(
        { username: req.params.username },
        { $set: toUpdate },
        { new: true }
      ).catch((err) => {
        errorManager(res, err);
      });
      res.json({ status: "updated", pastOrders: updatedOrders });
    } else {
      await PastOrders.create({
        username: req.params.username,
        pastOrders: req.body,
      }).catch((err) => {
        errorManager(res, err);
      });
      const pastOrders = await PastOrders.find({
        username: req.params.username,
      }).catch((err) => {
        errorManager(res, err);
      });
      res.json(pastOrders);
    }
  });

module.exports = router;
