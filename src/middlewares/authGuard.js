const { verifyToken } = require("../helpers/jwt");
const User = require("../models/User");

const authGuard = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          message: "لطفاً ابتدا وارد حساب کاربری خود شوید.",
        });
      }

      const decoded = await verifyToken(token);

      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({ message: "کاربر یافت نشد!" });
      }

      req.user = user;

      if (requiredRoles.length === 0) {
        return next();
      }
      const hasRequiredRole = requiredRoles.includes(user.role);

      if (!hasRequiredRole) {
        return res.status(403).json({
          message: "شما اجازه دسترسی به این مسیر را ندارید.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authGuard;
