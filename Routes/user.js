import express from 'express';
import { body } from 'express-validator';
import { login, profile, register, users, editProfile,deleteUser,resetPassword,forgotPassword} from '../Controllers/user.js';
import { Authenticated } from "../Middlewares/auth.js";

const router = express.Router();

// Register user
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('location').notEmpty().withMessage('Location is required'),
], register);

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

// Get all users
router.get('/all', users);

// Get user profile
router.get("/profile", Authenticated, profile);

// Edit user profile
router.put('/profile', [
  Authenticated,
  body('name', 'Name is required').not().isEmpty(),
  body('companyName', 'Company name is required').not().isEmpty(),
  body('phoneNumber', 'Phone number is required').not().isEmpty(),
  body('location', 'Location is required').not().isEmpty()
], editProfile);

// DELETE user
router.delete('/delete/:id', deleteUser);

// Forgot password request
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password/:userId/:token', resetPassword);
export default router;
