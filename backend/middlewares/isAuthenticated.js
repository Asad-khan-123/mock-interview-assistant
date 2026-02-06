import jwt from "jsonwebtoken";

const authmiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token missing or invalid",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    console.log("Decoded user from token:", req.user);
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
    });
  }
};

export default authmiddleware;
