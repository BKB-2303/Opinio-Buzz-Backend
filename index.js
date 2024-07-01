import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRouter from './Routes/user.js';
import productRouter from './Routes/product.js';
import cors from 'cors';

const app = express();
dotenv.config();
app.use(bodyParser.json());

app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

//  testing purpose
// app.get('/', (req, res) => res.json({ message: 'success' }));

// User Router
app.use('/api/user', userRouter);

// Product Router
app.use('/api/product', productRouter);

mongoose.connect(process.env.MONGODB_URI, {
  dbName: "Opinio_Buzz",
})
  .then(() => console.log("MongoDB Connected Successfully...!"))
  .catch((err) => console.log(err));

const port = 1000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
