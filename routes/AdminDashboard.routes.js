const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllProducts} = require('../controllers/AdminDashborard.controller');

// router.post('/upload', upload.single('productImage'), uploadProduct);
router.get('/product',  getAllProducts); // Add this line to handle GET request for fetching products

module.exports = router;
