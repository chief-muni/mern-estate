const express = require('express');
const { createListing, deleteListing, updateListing } = require('../controllers/listing.controller');
const verifyToken = require('../utils/verifyUser');
const router = express.Router();


router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.patch('/update/:id', verifyToken, updateListing);

module.exports = router;