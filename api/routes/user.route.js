const express = require('express');
const { test, upDateUser, deleteUser } = require('../controllers/user.controller');
const verifyToken = require('../utils/verifyUser');

const router = express.Router();

router.patch('/update/:userId', verifyToken, upDateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);

module.exports = router;