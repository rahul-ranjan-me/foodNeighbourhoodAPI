const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const Restaurant = new Schema({
  details: {
    name: String,
    address: String,
    image: String,
    chefImage: String,
    chefId: String,
    ratingUp: Number,
    ratingDown: Number,
    deliveryFee: Number,
    tagged: String,
  },
  menu: [
    {
      name: String,
      image: String,
      price: Number,
      id: String,
    },
  ],
});

module.exports = mongoose.model("Restaurant", Restaurant);
