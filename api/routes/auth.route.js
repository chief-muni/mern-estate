const express = require('express');
const { signUp, singIn, google } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', singIn);
router.post('/google', google)

module.exports = router;