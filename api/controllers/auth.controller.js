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
    const { password: pass, _id, createdAt, updatedAt, ...rest } = validUser._doc; // to accesss Mongo Doc
    res.status(200)
      .cookie('access_token', token, cookieOptions)
      .json(rest)
  } catch(error) {
    next(error)
  }
}
