const express = require('express');
const 
  { test, upDateUser, deleteUser, getUserListings, getUser } = require('../controllers/user.controller'),
  verifyToken = require('../utils/verifyUser')
;

const router = express.Router();

router.patch('/update/:userId', verifyToken, upDateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.get('/:id', verifyToken, getUser);
router.get('/listings/:userId', verifyToken, getUserListings);

module.exports = router;