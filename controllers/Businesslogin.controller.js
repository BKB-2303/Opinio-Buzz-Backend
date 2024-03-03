const TableData = require("../models/register");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Make sure to include the 'jsonwebtoken' library

const cookieParser = require('cookie-parser');


const Businesslogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await TableData.findOne({ email: email }); // Use TableData instead of UserModel

    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { email: user.email, role: user.role },
            'jwt-secret-key',
            { expiresIn: '1d' }
          );
          res.cookie('token', token);
          return res.json({Status:"success",role:user.role})

          // Additional logic if needed
          // For example, you can send a success response
          res.status(200).json({ status: 'ok' });
        } else {
          return res.json('The password is incorrect');
        }
      });
    } else {
      return res.json('No record existed');
    }
  } catch (err) {
    res.json(err);
  }
};

module.exports = { Businesslogin };
