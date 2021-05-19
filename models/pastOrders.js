const mongoose = require('mongoose'),
	Schema = mongoose.Schema

const PastOrders = new Schema({
  username: String,
  pastOrders: [
    {
      status: String,
      restaurantName: String,
      date: String,
      amount: Number, 
      chefId: String,
      orders: [
        {
          itemName: String,
          quantity: Number,
          itemId: String
        }
      ]
    }
  ]
});

module.exports = mongoose.model('PastOrders', PastOrders);