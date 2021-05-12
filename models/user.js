const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
	userId: String,
	admin : {
		type: Boolean,
		default: false
	},
	password: String,
	phoneNumber: String,
	email: String,
	address: {
    postal: String
  }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);