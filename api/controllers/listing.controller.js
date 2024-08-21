const Listing = require("../models/listing.model");
const errorHandler = require("../utils/error");

exports.createListing = async(req, res, next) => {
  try {
    req.body.userRef = req.user.id;
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch(error) {
    next(error);
  }
}

exports.deleteListing = async(req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if(!listing) return next(errorHandler(404, 'Listing not found'));
  if(req.user.id !== listing.userRef.toString()) return next(errorHandler(401, 'You can only delete your own listings!'));
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(204).json('Listing deleted successfully')
  } catch(error) {
    next(error);
  }
}

exports.updateListing = async(req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if(!listing) return next(errorHandler(404, 'Listing not found'));
  if(req.user.id !== listing.userRef.toString()) return next(errorHandler(401, 'You can only update your own listings!'));
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error)
  }
}