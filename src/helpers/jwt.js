const jwt = require("jsonwebtoken");

const generateAccessToken = async (userID, userRole) => {
  try {
    return jwt.sign(
      { id: userID, role: userRole },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
      }
    );
  } catch (error) {
    throw error;
  }
};

const generateRefreshToken = async (userID, userRole) => {
  try {
    return jwt.sign(
      { id: userID, role: userRole },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
      }
    );
  } catch (error) {
    throw error;
  }
};

const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw error;
  }
};

const verifyRefreshToken = async (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
