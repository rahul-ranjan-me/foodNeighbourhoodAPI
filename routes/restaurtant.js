const express = require('express')
const router = express.Router()
const Restaurant = require('../models/restaurant')
const Verify = require('./verify')
const _ = require('lodash')
const restaurant = require('../models/restaurant')

/* GET users listing. */
router.route('/')
  .get(Verify.verifyOrdinaryUser, (req, res, next) => {
    Restaurant.find({}, (err, restaurant) => {
      if(err) res.send({status: 'error', description: err});
      res.json(restaurant);
    });
  })
  .post(Verify.verifyOrdinaryUser, (req, res, next) => {
		Restaurant.create(req.body, (err, restaurant) => {
			if(err) throw err;
			Restaurant.find({}, (err, restaurant) => {
				if(err) throw err;
				res.json(restaurant);
			});
		});
	})

router.route('/id/:chefId')
  .get(Verify.verifyOrdinaryUser, (req, res, next) => {
    Restaurant.find({"details.chefId": req.params.chefId}, (err, restaurant) => {
      if(err) res.send({status: 'error', description: err});
      res.json(restaurant[0]);
    });
  })
  .put(Verify.verifyOrdinaryUser, (req, res, next) => {
    var toUpdate = {};
    for(var x in req.body){
			if(x){
				toUpdate[x] = req.body[x];
			}
		}
    Restaurant.findOneAndUpdate({"details.chefId": req.params.chefId}, { $set:
			toUpdate
		},
		{
			new:true
		}, (err, restaurant) => {
      if(err) throw err;
      return res.status(200).json({status: 'updated'});
		});
	})

router.route('/top10')
  .get(Verify.verifyOrdinaryUser, (req, res, next) => {
    Restaurant.find({}, (err, restaurant) => {
      if(err) res.send({status: 'error', description: err});
      const sorted = _.orderBy(restaurant, ['details.ratingUp'], ['desc'])
      const topRestaurant = []
      sorted.splice(0, 10).map((restaurant) => {
        topRestaurant.push(restaurant.details)
      })
      res.json(topRestaurant);
    });
  })

router.route('/search')
  .get(Verify.verifyOrdinaryUser, (req, res, next) => {
    const { q, all } = req.query,
          key = `.*${q}.*`
          filter = {
            $or: [
              { 'details.tagged' : {"$regex": key, "$options": "i" } },
              { 'details.name' : {"$regex": key, "$options": "i" } },
              { 'details.address' : {"$regex": key, "$options": "i"} },
              { 'menu' : { "$elemMatch": { name: { "$regex": key, "$options": "i" } } } }
            ]
          }
    
    Restaurant.find(filter, (err, restaurants) => {
      if(all) {
        res.json(restaurants);
      } else {
        let details = []
        restaurants.forEach(restaurant => {
          details.push(restaurant.details)
        })
        res.json(details);
      }
      
    });
  })

module.exports = router;