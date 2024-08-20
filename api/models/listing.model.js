const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a name for the Lisitng'],
    maxlength: [62, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  regularPrice: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  isFurnished: {
    type: Boolean,
    required: true
  },
  hasParking: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  isOffer: {
    type: Boolean,
    required: true
  },
  imageUrls: {
    type: Array,
    required: true
  },
  userRef: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;