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
};

exports.getListing = async(req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404), 'Sorry Listing not found');
    res.status(200).json(listing);
  } catch (error) {
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

// For search functionality
exports.getListings = async(req, res, next) => {
  try {
    const
      searchTerm = req.query.searchTerm || '',
      sort = req.query.sort || 'createdAt',
      order = req.query.order || 'desc',
      limit = parseInt(req.query.limit || 10),
      startIndex = parseInt(req.query.startIndex || 0)
    ;
    let 
      isOffer = req.query.isOffer,
      isFurnished = req.query.isFurnished,
      hasParking = req.query.hasParking,
      type = req.query.type
    ;
    // For booleans & options
    if(isOffer === undefined || isOffer === false) {
      isOffer = { $in: [false, true] };
    }
    if(isFurnished === undefined || isFurnished === false) isFurnished = { $in: [true, false] };
    if(hasParking === undefined || hasParking === false) hasParking = { $in: [true, false] };
    if(type === undefined || type === 'all') type = { $in: ['rent', 'sale'] };

    const listings = await Listing.find({
      title: { $regex: searchTerm, $options: 'i' },
      isOffer,
      isFurnished,
      hasParking,
      type
    })
      .sort({[sort]: order})
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);

  } catch(error) {
    next(error);
  }
}