import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log(token);

    if (!token) {
      return res.status(401).json({
        message: "No token found",
      });
    }
    const decoded = jwt.verify(token, "shhhhh");

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
