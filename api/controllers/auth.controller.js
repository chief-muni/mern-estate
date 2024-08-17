const 
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken')
;
const cookieOptions = require('../utils/cookieOptions');
const
  User = require("../models/user.model"),
  errorHandler = require('../utils/error'),
  jwtSecret = process.env.JWT_SECRET
;

exports.signUp = async(req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 11);
  try{
    // const newUser = await User.create({ username, email, password });
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: `User ${username} created successfully`
    })
  } catch(error) {
    next(errorHandler(550, `Error: ${error.message}`));
  }
}

exports.singIn = async(req, res, next) => {
  const { email, password } = req.body;
  try{
    const validUser = await User.findOne({ email });
    if(!validUser) return next(errorHandler(404, 'User not found'));
    const confirmedUser = await bcrypt.compare(password, validUser.password);
    if(!confirmedUser) return next(errorHandler(401, 'Wrong credentials')); // change to User not found in production
    // Create JWT Token
    const token = jwt.sign({ id: validUser._id }, jwtSecret);
    // Remove password & sensitive info
    const { password:pass, createdAt, updatedAt, ...rest } = validUser._doc; // to accesss Mongo Doc
    res.status(200)
      .cookie('access_token', token, cookieOptions)
      .json(rest)
  } catch(error) {
    next(error)
  }
}

exports.google = async(req, res, next) => {
  try{
    const { name, email, photo } = req.body;
    const user = await User.findOne({ email });
    if(user) {    // Generate and send token
      const token = jwt.sign({ id: user._id }, jwtSecret);
      const { password:pass, createdAt, updatedAt, ...rest } = user._doc;
      res.status(200)
        .cookie('access_token', token, cookieOptions)
        .json(rest);
    } else {      // Create new user
      // Generating a password since its required to create new user
      const generatedPassword = 
        Math.random().toString(36).slice(-8) + 
        Math.random().toString(36).slice(-8); // 392fuh4fj49d0kr9  => 16 chars
      const hashedPassword = await bcrypt.hash(generatedPassword, 11);
      const newUser = await User.create({ 
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(36).slice(-4) , 
        email, 
        password: hashedPassword, 
        avatar: photo 
      });
      // console.log({newUser});
      const token = jwt.sign({ id: newUser._id }, jwtSecret);
      const { password:pass, ...rest } = newUser._doc;
      res.status(201)
        .cookie('access_token', token, cookieOptions)
        .json(rest)
    }
  } catch(error) {
    next(error)
  }
}