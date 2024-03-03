
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   productName: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     default: 'Not Approved',
//   },
//   userEmail: {
//     type: String,
//     required: true,
//   },
// }, {
//   timestamps: true,
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String, // Add URL field
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Not Approved',
  },
  userEmail: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
