const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    store: String,
    price: Number,
    discount: Number,
    link: String,
    internalName: String,
    title: String,
    normalPrice: Number,
    rating: Number,
    backgroundImage: String
});


const gameSchema = new mongoose.Schema({
    rawgId: String,
    title: String,
    platforms: String,
    rating: Number,
    releaseDate: Date,
    backgroundImage: String,
    offers: [offerSchema]
});

module.exports = mongoose.model("Game", gameSchema);
