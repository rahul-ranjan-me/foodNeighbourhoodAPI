const express = require('express')
const router = express.Router()
const PastOrders = require('../models/pastOrders')
const Verify = require('./verify')
const _ = require('lodash')

/* GET users listing. */
router.route('/:username')
  .get(Verify.verifyOrdinaryUser, (req, res, next) => {
    PastOrders.find({username: req.params.username}, (err, pastOrders) => {
      if(err) res.send({status: 'error', description: err});
      res.json(pastOrders);
    });
  })
  .post(Verify.verifyOrdinaryUser, (req, res, next) => {
    PastOrders.find({username: req.params.username}, (err, orders) => {
      if(orders.length > 0) {
        let pastOrdersTemp = orders[0].pastOrders
        pastOrdersTemp.push(req.body)
        var toUpdate = {pastOrders: pastOrdersTemp}
        PastOrders.findOneAndUpdate({username: req.params.username}, { $set:
          toUpdate
        },
        {
          new:true
        }, (err, pastOrders) => {
          if(err) throw err;
          return res.status(200).json({status: 'updated', pastOrders: pastOrders});
        });
      } else {
        PastOrders.create({username: req.params.username, pastOrders: req.body}, (err, restaurant) => {
          if(err) throw err;
          PastOrders.find({username: req.params.username}, (err, restaurant) => {
            if(err) throw err;
            res.json(restaurant);
          });
        });
      }
    });
	})

module.exports = router;