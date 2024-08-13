const 
  bcrypt = require('bcryptjs'),
  User = require("../models/user.model")
;

exports.signUp = async(req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 11);
  try{
    // const newUser = await User.create({ username, email, password });
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({
      success: `User ${username} created successfully`
    })
  } catch(error) {
    res.status(500).json(error)
  }

}
