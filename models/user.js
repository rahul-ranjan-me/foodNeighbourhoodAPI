const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

module.exports = mongoose.model('User', User);