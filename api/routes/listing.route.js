const express = require('express');
const { createListing, deleteListing, updateListing, getListing, getListings } = require('../controllers/listing.controller');
const verifyToken = require('../utils/verifyUser');
const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.patch('/update/:id', verifyToken, updateListing);
router.get('/:id', getListing);
router.get('/', getListings);

module.exports = router;