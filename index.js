

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const Businessregister = require('./routes/businessregister.routes.js');
const Businesslogin = require('./routes/businesslogin.routes.js');
const BusinessProducts = require('./routes/businessproducts.routes.js');
const AdminDashboard = require('./routes/AdminDashboard.routes.js');
const Product = require('./models/Product.js');
const UserModel = require('./models/register.js');

const app = express();
const port = process.env.PORT || 3001;
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/register', Businessregister);
app.use('/login', Businesslogin);
app.use('/businessowner', BusinessProducts);
app.use('/admin', AdminDashboard);
app.use('/uploads', express.static('uploads'));

app.get('/businessowner/products', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log('Received User Email in Backend:', userEmail);
    const products = await Product.find({ userEmail });
    console.log('Fetched Products:', products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const Review = mongoose.model('Review', {
  productId: mongoose.Schema.Types.ObjectId,
  name: String,
  rating: Number,
  review: String,
  selectedImage: String,
});

app.post('/admin/product/:id/review', async (req, res) => {
  const { id } = req.params;
  const { name, rating, review, selectedImage } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newReview = new Review({
      productId: id,
      name,
      rating,
      review,
      selectedImage,
    });

    await newReview.save();
    res.json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put('/admin/product/:id', async (req, res) => {
    const productId = req.params.id;
  
    try {
      await Product.findByIdAndUpdate(productId, { status: req.body.status });
  
      res.json({ success: true, message: 'Product status updated successfully' });
    } catch (error) {
      console.error('Error updating product status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  app.get('/approved-products', async (req, res) => {
    try {
      const approvedProducts = await Product.find({ status: 'Approved' });
      res.json(approvedProducts);
    } catch (error) {
      console.error('Error fetching approved products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.get('/admin/product/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json(product);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  // Add this route to fetch all reviews for a given product
  app.get('/admin/product/:id/reviews', async (req, res) => {
    const { id } = req.params;
  
    try {
      const reviews = await Review.find({ productId: id });
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //
  app.delete('/admin/product/:productId', async (req, res) => {
    const { productId } = req.params;
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  //

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  UserModel.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.send({ Status: "User not existed" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD
        }
      });

      var mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Reset Password Link',
        text: `Hello!\n\nYou have requested a password reset for your Opinio Buzz account.\n\nClick the following link to reset your password:\n\n${baseURL}/reset_password/${user._id}/${token}\n\nPlease note:\n- Do not share this link with anyone.\n\nIf you did not request this, please ignore this email.\n\nThank you and best regards,\nOpinio Buzz`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          return res.send({ Status: "Success" });
        }
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).send({ Status: "Error" });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
