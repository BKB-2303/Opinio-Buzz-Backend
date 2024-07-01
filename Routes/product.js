import express from 'express';
import { check } from 'express-validator';
import { addProduct, deleteProductById, getProductById, getProducts, updateProductById,getAllProducts,updateProductDetails } from '../Controllers/product.js';
import { Authenticated } from '../Middlewares/auth.js';
import { submitReview,getallReview,getAllReviewsByEmail,deleteReview } from '../Controllers/review.js'
const router = express.Router();

// Validation rules
const validateProduct = [
  check('companyName').notEmpty().withMessage('Company name is required'),
  check('companyImage').notEmpty().withMessage('Company image is required'),
  check('description').notEmpty().withMessage('Description is required'),
  check('contactNumber')
    .isLength({ min: 10, max: 10 })
    .withMessage('Contact number must be 10 characters long'),
  check('aboutCompany').notEmpty().withMessage('About company is required'),
  check('companyCategory').notEmpty().withMessage('Company category is required')
];

// Add product route with validation
router.post('/add', Authenticated, validateProduct, addProduct);

//specific user
router.get('/all', getProducts);

//fetch all product
router.get('/allProducts',getAllProducts);

//fetch  product by id
router.get('/:id', getProductById);

//update  product by id ,this is for admin
router.put('/:id', updateProductById);

//update  product by id ,this is for user
router.put('/details/:id', updateProductDetails);


//delete  product by id
router.delete('/:productId', deleteProductById);

//submit reviews with id
router.post('/:id/reviews', submitReview);

//get all reviews by id
router.get('/:id/reviews',getallReview);

//get all reviews by email
router.get('/reviews/user/:userEmail', getAllReviewsByEmail);

//delete  reviews by id
router.delete('/reviews/:reviewId', deleteReview);

export default router;
