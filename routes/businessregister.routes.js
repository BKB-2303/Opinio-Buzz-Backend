const express = require('express');
const router = express.Router();
const controller = require('../controllers/BusinessRegister.controller.js'); // Import the controller


router.post('/businessregister', controller.businessregister);


module.exports = router;