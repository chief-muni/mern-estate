const Listing = require("../models/listing.model")

exports.createListing = async(req, res, next) => {
  try {
    req.body.userRef = req.user.id;
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch(error) {
    next(error);
  }
}