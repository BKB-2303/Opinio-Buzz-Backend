const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv'); // Load environment variables from .env file

dotenv.config(); // Load environment variables

const Businessregister = require('./routes/businessregister.routes.js');
const Businesslogin = require('./routes/businesslogin.routes.js');
const BusinessProducts = require('./routes/businessproducts.routes.js');
const AdminDashboard = require('./routes/AdminDashboard.routes.js');
const Product = require('./models/Product.js');
const UserModel = require('./models/register.js');

const app = express();
const port = process.env.PORT || 3001;

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

// ... Rest of your code

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
