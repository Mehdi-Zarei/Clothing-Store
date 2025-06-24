const { Op } = require("sequelize");
const {
  errorResponse,
  successResponse,
} = require("../../helpers/responseMessages");
const Category = require("../../models/Category");
const { categoryIdParamSchema } = require("./category.validator");

exports.create = async (req, res, next) => {
  try {
    const { title, slug } = req.body;

    const isCategoryExist = await Category.findOne({
      where: {
        [Op.or]: [{ title }, { slug }],
      },
    });

    if (isCategoryExist) {
      return errorResponse(res, 409, "این دسته بندی از قبل وجود دارد!");
    }

    const newCategory = await Category.create({
      title,
      slug,
    });

    return successResponse(
      res,
      201,
      "دسته بندی جدید با موفقیت ساخته شد.",
      newCategory
    );
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll();

    if (!categories.length) {
      return errorResponse(res, 404, "دسته بندی یافت نشد.");
    }

    return successResponse(res, 200, categories);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = categoryIdParamSchema.validate(req.params);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return errorResponse(res, 404, "دسته بندی یافت نشد.");
    }

    return successResponse(res, 200, category);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { title, slug } = req.body;
    const { id } = req.params;

    const { error } = categoryIdParamSchema.validate(req.params);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return errorResponse(res, 404, "دسته بندی یافت نشد.");
    }

    if (title) {
      category.title = title;
    }

    if (slug) {
      category.slug = slug;
    }

    await category.save();

    return successResponse(res, 200, "دسته بندی با موفقیت آپدیت شد.");
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = categoryIdParamSchema.validate(req.params);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const remove = await Category.destroy({ where: { id } });

    if (!remove) {
      return errorResponse(res, 404, "دسته بندی ای یافت نشد!");
    }

    return successResponse(res, 200, "دسته بندی با موفقیت حذف گردید.");
  } catch (error) {
    next(error);
  }
};
