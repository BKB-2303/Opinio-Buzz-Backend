

const Product = require('../models/Product');

const uploadProduct = async (req, res) => {
  try {
    const { productName, description, userEmail, url } = req.body;
    const image = req.file.filename;

    const newProduct = new Product({
      productName,
      description,
      url, // Include the URL field
      image,
      userEmail,
    });

    await newProduct.save();

    res.json({ success: true, message: 'Product uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  uploadProduct,
};




