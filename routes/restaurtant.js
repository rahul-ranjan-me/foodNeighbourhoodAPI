const express = require("express");
const router = express.Router();
const Restaurant = require("../models/restaurant");
const Verify = require("./verify");
const _ = require("lodash");
const errorManager = require("./errorManager");

router
  .route("/")
  .get(Verify.verifyOrdinaryUser, async (req, res, next) => {
    const restaurants = await Restaurant.find({}).catch((err) => {
      errorManager(res, err);
    });
    res.json(restaurants);
  })
  .post(Verify.verifyOrdinaryUser, async (req, res, next) => {
    await Restaurant.create(req.body).catch((err) => {
      errorManager(res, err);
    });
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  });

router
  .route("/id/:chefId")
  .get(Verify.verifyOrdinaryUser, async (req, res, next) => {
    const restaurant = await Restaurant.find({
      "details.chefId": req.params.chefId,
    }).catch((err) => {
      errorManager(res, err);
    });
    res.json(restaurant[0]);
  })
  .put(Verify.verifyOrdinaryUser, async (req, res, next) => {
    var toUpdate = {};
    for (var x in req.body) {
      if (x) {
        toUpdate[x] = req.body[x];
      }
    }
    await Restaurant.findOneAndUpdate(
      { "details.chefId": req.params.chefId },
      { $set: toUpdate },
      { new: true }
    ).catch((err) => {
      errorManager(res, err);
    });
    res.status(200).json({ status: "updated" });
  });

router
  .route("/top10")
  .get(Verify.verifyOrdinaryUser, async (req, res, next) => {
    const restaurant = await Restaurant.find({}).catch((err) => {
      errorManager(res, err);
    });
    const sorted = _.orderBy(restaurant, ["details.ratingUp"], ["desc"]);
    const topRestaurant = [];
    sorted.splice(0, 10).map((restaurant) => {
      topRestaurant.push(restaurant.details);
    });
    res.json(topRestaurant);
  });

router
  .route("/search")
  .get(Verify.verifyOrdinaryUser, async (req, res, next) => {
    const { q, all } = req.query,
      key = `.*${q}.*`,
      filter = {
        $or: [
          { "details.tagged": { $regex: key, $options: "i" } },
          { "details.name": { $regex: key, $options: "i" } },
          { "details.address": { $regex: key, $options: "i" } },
          { menu: { $elemMatch: { name: { $regex: key, $options: "i" } } } },
        ],
      };
    const restaurants = await Restaurant.find(filter).catch((err) => {
      errorManager(res, err);
    });
    if (all) {
      res.json(restaurants);
    } else {
      let details = [];
      restaurants.forEach((restaurant) => {
        details.push(restaurant.details);
      });
      res.json(details);
    }
  });

router
  .route("/search/tagged")
  .get(Verify.verifyOrdinaryUser, async (req, res, next) => {
    const { q } = req.query,
      key = `.*${q}.*`,
      filter = {
        $or: [{ "details.tagged": { $regex: key, $options: "i" } }],
      };
    const restaurants = await Restaurant.find(filter).catch((err) => {
      errorManager(res, err);
    });
    let details = [];
    restaurants.forEach((restaurant) => {
      details.push(restaurant.details);
    });
    res.json(details);
  });

module.exports = router;
