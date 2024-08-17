const express = require('express');
const { test, upDateUser } = require('../controllers/user.controller');
const verifyToken = require('../utils/verifyUser');

const router = express.Router();

// router.get('/test', test);
router.patch('/update/:userId', verifyToken, upDateUser)

module.exports = router;