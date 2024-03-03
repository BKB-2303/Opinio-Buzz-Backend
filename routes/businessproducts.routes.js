const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadProduct } = require('../controllers/businessproducts.controller');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Define routes
router.post('/upload', upload.single('productImage'), uploadProduct);
// router.get('/products', controller.getBusinessProducts);
module.exports = router;
