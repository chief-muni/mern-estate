const bcrypt = require('bcryptjs');
const errorHandler = require("../utils/error");
const User = require('../models/user.model');
const Listing = require('../models/listing.model');

exports.test = async(req, res) => {
  res.status(200).json({
    message: 'API is working well from routes to controller'
  });
};

exports.upDateUser = async(req, res, next) => {
  if(req.user.id !== req.params.userId) return next(errorHandler(401, 'Unauthorized to update this account'));
  try {
    if(req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 11)
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
    } }, { new: true, runValidators: true });

    const { password, ...rest } = updatedUser._doc;
    res.status(201).json(rest)
  } catch(error) {
    next(error)
  }
};

exports.deleteUser = async(req, res, next) => {
  if(req.user.id !== req.params.userId) return next(errorHandler(401, 'Unauthorized to delete this account'));
  try {
    await User.findByIdAndDelete(req.params.userId);
    res
      .clearCookie('access_token')
      .status(204)
      .json('User deleted successfully')
    ;
  } catch(error) {
    next(error);
  }
};

exports.getUserListings = async(req, res, next) => {
  if(req.user.id === req.params.userId) {
    try {
      const listings = await Listing.find({ userRef: req.user.id });
      if(!listings) return next(errorHandler(404, 'You dont have any lisitings yet'));
      res.status(200)
        .json(listings);
    } catch (error) {
      next(error)
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
}