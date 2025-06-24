const User = require("../../models/User");
const { createPagination } = require("../../helpers/pagination");
const {
  successResponse,
  errorResponse,
} = require("../../helpers/responseMessages");

const {
  paginationQuerySchema,
  userIdParamSchema,
} = require("./user.validator");

exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { error } = paginationQuerySchema.validate(req.query);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    if (count === 0) {
      return errorResponse(res, 404, "هیچ کاربری یافت نشد.");
    }

    const pagination = createPagination(page, limit, count, "Users");

    return successResponse(res, 200, { users: rows, pagination });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = userIdParamSchema.validate(req.params);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const user = await User.findByPk(id, {
      raw: true,
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return errorResponse(res, 404, "کاربری یافت نشد.");
    }

    return successResponse(res, 200, user);
  } catch (error) {
    next(error);
  }
};

exports.toggleBanStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = userIdParamSchema.validate(req.params);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 404, "کاربر یافت نشد.");
    }

    if (user.isRestrict) {
      user.isRestrict = false;
      successResponse(res, 200, "کاربر باموفقیت از محدودیت خارج گردید.");
    } else {
      user.isRestrict = true;
      successResponse(res, 200, "کاربر باموفقیت محدود گردید.");
    }

    await user.save();

    return;
  } catch (error) {
    next(error);
  }
};

exports.changeRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = userIdParamSchema.validate(req.params);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, 404, "کاربر یافت نشد.");
    }

    if (user.role === "USER") {
      user.role = "ADMIN";
      successResponse(res, 200, "نقش کاربر به ADMIN تغییر کرد.");
    } else {
      user.role = "USER";
      successResponse(res, 200, "نقش کاربر به USER تغییر کرد.");
    }
    await user.save();
    return;
  } catch (error) {
    next(error);
  }
};
