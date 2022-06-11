const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creation_date: { type: Date, default: Date.now() },
  images: { type: [String], required: false },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  ratings: [
    {
      userRating: { type: Number, required: true },
      userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
    }
  ],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

placeSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('Place', placeSchema);