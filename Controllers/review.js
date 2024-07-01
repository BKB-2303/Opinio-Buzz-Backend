import { Products } from "../Models/Product.js";
import { Review } from "../Models/Review.js";

// Submit review for a product
export const submitReview = async (req, res) => {
  const { id } = req.params; // Product ID
  const { Name, userEmail, avatarImage, ratingCount, description } = req.body;

  try {
  
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

   
    const newReview = await Review.create({
      Name,
      userEmail,
      productId: id, 
      avatarImage,
      ratingCount,
      description,
    });

    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//get review for a product
export const getallReview =async (req, res) => {
  const { id } = req.params;
try {
    const reviews = await Review.find({ productId: id });
    res.json(reviews);
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//get all reviews by email
export const getAllReviewsByEmail = async (req, res) => {
  const { userEmail } = req.params;
  try {
    const reviews = await Review.find({ userEmail });
    if (reviews.length === 0) {
      return res.status(404).json({ error: 'No reviews found for this user email' });
    }
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews by email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a review by ID
export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};