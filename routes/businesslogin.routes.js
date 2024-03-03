const express = require('express');
const router = express.Router();
const controller = require('../controllers/Businesslogin.controller.js'); // Import the controller


router.post('/businesslogin', controller.Businesslogin);

module.exports = router;