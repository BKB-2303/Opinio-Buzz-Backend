
import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

export const Authenticated = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    const decoded = jwt.verify(token,"!@#$%^&*()");
    const id = decoded.userId;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
//old code
// import jwt from "jsonwebtoken";
// import { User } from "../Models/User.js";

// export const Authenticated = async (req, res, next) => {
//   const token = req.header("Auth");

//   if (!token) return res.json({ message: "Login first" });

//   const decoded = jwt.verify(token, "!@#$%^&*()");

//   const id = decoded.userId;

//   let user = await User.findById(id);

//   if (!user) return res.json({ message: "User not exist" });

//   req.user = user;
//   next();

//   // console.log(decoded)
// };

