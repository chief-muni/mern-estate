const 
  bcrypt = require('bcryptjs'),
  User = require("../models/user.model")
;
const errorHandler = require('../utils/error');

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
    // next(error);
    next(errorHandler(550, `Error: ${error.message}`));
  }

}
