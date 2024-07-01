import { validationResult } from 'express-validator';
import { Products } from '../Models/Product.js';
import nodemailer from 'nodemailer';
// Add product old code without send email
// export const addProduct = async (req, res) => {
//   // Handle validation errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { companyName, url, companyImage, servicesImages, description, contactNumber, aboutCompany, companyCategory } = req.body;
//   const userEmail = req.user.email; // Use the email from the authenticated user

//   try {
//     let product = await Products.create({
//       companyName,
//       url,
//       companyImage,
//       servicesImages,  // Accept multiple images
//       description,
//       contactNumber,
//       aboutCompany,
//       companyCategory,  // Include company category
//       userEmail, // Add user email
//       status: 'Not approved' // Default status
//     });
//     res.json({ message: 'Product added successfully...!', product });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const addProduct = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { companyName, url, companyImage, servicesImages, description, contactNumber, aboutCompany, companyCategory } = req.body;
  const userEmail = req.user.email; // Use the email from the authenticated user

  try {
    // Create the product
    let product = await Products.create({
      companyName,
      url,
      companyImage,
      servicesImages,  // Accept multiple images
      description,
      contactNumber,
      aboutCompany,
      companyCategory,  // Include company category
      userEmail, // Add user email
      status: 'Not approved' // Default status
    });

    // Configure the transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail', 'Yahoo', 'Outlook'
      auth: {
        user: process.env.GMAIL_USER, // Your email address
        pass: process.env.GMAIL_PASSWORD, // Your email password or app-specific password
      },
    });

    // Send email notification with HTML content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Your email address
      subject: 'New Product Added',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="text-align: center; color: #333;">New Product Added</h2>
          <p style="font-size: 16px; color: #555;">A new product has been added by <strong>${userEmail}</strong>:</p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;">
              <strong>Company Name:</strong> ${companyName}
            </li>
            <li style="margin: 10px 0;">
              <strong>Website URL:</strong> <a href="${url}" target="_blank" style="color: #1a73e8;">${url}</a>
            </li>
            <li style="margin: 10px 0;">
              <strong>Description:</strong> ${description}
            </li>
            <li style="margin: 10px 0;">
              <strong>Contact Number:</strong> ${contactNumber}
            </li>
            <li style="margin: 10px 0;">
              <strong>About Company:</strong> ${aboutCompany}
            </li>
            <li style="margin: 10px 0;">
              <strong>Company Category:</strong> ${companyCategory}
            </li>
            <li style="margin: 10px 0;">
              <strong>Status:</strong> Not approved
            </li>
          </ul>
          <p style="text-align: center; color: #777;">&copy; ${new Date().getFullYear()} Opinio Buzz. All Rights Reserved.</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ message: 'Product added successfully...!', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products by email
export const getProducts = async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log('Received User Email in Backend:', userEmail);
    const products = await Products.find({ userEmail });
    console.log('Fetched Products:', products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching product data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Get product by Id
export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    let product = await Products.findById(id);
    if (!product) return res.status(404).json({ message: 'Invalid Id' });
    res.json({ message: "Specific product", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product by Id old code without email send
// export const updateProductById = async (req, res) => {
//   const productId = req.params.id;

//   try {
//     await Products.findByIdAndUpdate(productId, { status: req.body.status });

//     res.json({ success: true, message: 'Product status updated successfully' });
//   } catch (error) {
//     console.error('Error updating product status:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
const sendEmail = async (toEmail, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use the appropriate email service
    auth: {
      user: process.env.GMAIL_USER, // Your email address
      pass: process.env.GMAIL_PASSWORD, // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// (this update details is for admin )Update product status by Id and send email notification

export const updateProductById = async (req, res) => {
  const productId = req.params.id;
  const { status } = req.body;

  try {
    // Update product status in the database
    await Products.findByIdAndUpdate(productId, { status });

    // Fetch the updated product
    const updatedProduct = await Products.findById(productId);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Send email notification to the user's email
    const userEmail = updatedProduct.userEmail;
    const subject = 'Product Status Update';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="text-align: center; color: #333;">Product Status Update</h2>
        <p style="font-size: 16px; color: #555;">
          <strong>${updatedProduct.companyName}</strong>
        </p>
        <p style="font-size: 16px; color: #555;">
          The status of your uploaded product has been updated:
        </p>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 10px 0;">
            <strong>New Status:</strong> ${status}
          </li>
          <li style="margin: 10px 0;">
            <strong>Category:</strong> ${updatedProduct.companyCategory}
          </li>
        </ul>
        <p style="text-align: center; color: #777;">
          &copy; ${new Date().getFullYear()} Opinio Buzz. All Rights Reserved.
        </p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 10px; text-align: center;">
          <p style="font-size: 14px; color: #888;">
            From Opinio Buzz Team
            <br />
            If you have any queries, please feel free to contact us:
            <br />
            Email: <a href="mailto:opiniobuzzsupport@gmail.com" style="color: #1a73e8;">opiniobuzzsupport@gmail.com</a>
            <br />
            Website: <a href="https://opiniobuzz.com" target="_blank" style="color: #1a73e8;">OpinioBuzz.com</a>
          </p>
        </div>
      </div>
    `;

    await sendEmail(userEmail, subject, htmlContent);

    res.json({ success: true, message: 'Product status updated successfully' });
  } catch (error) {
    console.error('Error updating product status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Delete product by Id
export const deleteProductById =  async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Products.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//this updateproduct deltails is for user
export const updateProductDetails = async (req, res) => {
  const productId = req.params.id;
  const { companyName, companyCategory, companyImage, servicesImage, description, contactNumber, aboutCompany } = req.body;

  try {
    // Update product details in the database
    const updatedProduct = await Products.findByIdAndUpdate(productId, {
      companyName,
      companyCategory,
      companyImage,
      servicesImage,
      description,
      contactNumber,
      aboutCompany
    }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true, message: 'Product details updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};