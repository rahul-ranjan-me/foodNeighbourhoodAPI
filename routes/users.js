const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Verify = require('./verify')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res) => {
	
});

router.post('/login', (req, res, next) => {
  User.find({username: req.body.userId}, (err, user) => {
    if(err) res.send({status: 'error', description: err});
    if(user.length < 1) {
      User.register(new User(
        {
          username: req.body.userId,
          admin: req.body.admin,
          name: req.body.name,
          email: req.body.email,
          location: req.body.location,
          phoneNumber: req.body.phoneNumber,
          address: req.body.address,
          photo: req.body.photo,
          authType: req.body.authType
        }
      ), 'temp', (err, user) => {
        if(err) res.send({status: 'error', description: err});
        var token = Verify.getToken({user});
        res.json({user: user, token: token})
      })
    } else {
      var token = Verify.getToken({user});
      res.json({user: user[0], token: token})
    } 
  });
});

router.get('/logout', (req, res) => {
  res.status(200).json({
		status: 'logout'
	}); 
});

router.route('/:userId')
	.get(Verify.verifyOrdinaryUser, (req, res, next) => {
    User.find({username: req.params.userId}, (err, user) => {
			if(err) res.send({status: 'error', description: err});
			res.json(user);
		});
	})
	.put(Verify.verifyOrdinaryUser, (req, res, next) => {
    console.log('coming here')
		var toUpdate = {};
		for(var x in req.body){
			if(x){
				toUpdate[x] = req.body[x];
			}
		}
		User.findOneAndUpdate({username: req.params.userId}, { $set:
			toUpdate
		},
		{
			new:true
		}, (err, user) => {
			if(err) throw err;
			var dataToSend = {
				id: user._id,
        admin: user.admin,
        name: user.name,
        email: user.email,
        location: user.location,
        phoneNumber: user.phoneNumber,
        address: user.address,
        photo: user.photo,
        authType: user.authType
			} 
      return res.status(200).json(dataToSend);
		});

	});

module.exports = router;