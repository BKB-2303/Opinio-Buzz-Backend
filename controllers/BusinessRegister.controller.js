const TableData = require("../models/register");
const bcrypt = require("bcrypt");

const businessregister = async (req, res) => {
  const { name, email, phone, businessName, location, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await TableData.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists. Please choose a different email.' });
    }

    // If the email is unique, proceed with user registration
    const hash = await bcrypt.hash(password, 10);
    const user = await TableData.create({
      name,
      email,
      phone,
      businessName,
      location,
      password: hash,
    });

    res.json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { businessregister };



    