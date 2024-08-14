const express = require('express');
const { signUp, singIn } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', singIn);

module.exports = router;