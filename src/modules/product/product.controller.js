const fs = require("fs");

const { createPagination } = require("../../helpers/pagination");

const {
  successResponse,
  errorResponse,
} = require("../../helpers/responseMessages");

const Category = require("../../models/Category");
const Product = require("../../models/Product");
const { paginationQuerySchema } = require("../user/user.validator");
const {
  productSchema,
  updateProductSchema,
  IdParamSchema,
} = require("./product.validators");
const removeUploadedImages = require("../../helpers/removeUploadedImages");

exports.create = async (req, res, next) => {
  try {
    let { name, description, specifications, price, stock, categoryId } =
      req.body;

    if (specifications) specifications = JSON.parse(specifications);

    const { error } = productSchema.validate(
      {
        name,
        description,
        price,
        stock,
        categoryId,
        specifications,
      },
      { abortEarly: false }
    );

    let images = [];

    if (req.files) {
      images = req.files.map(
        (images) => `public/images/products/${images.filename}`
      );
    }

    if (error) {
      removeUploadedImages(images);

      return res.status(400).json({
        success: false,
        message: "ورودی نامعتبر است",
        error: error.details[0].message,
      });
    }

    const categoryIdExist = await Category.findOne({
      where: { id: categoryId },
    });

    if (!categoryIdExist) {
      removeUploadedImages(images);

      return errorResponse(res, 404, "دسته بندی با این شناسه یافت نشد.");
    }

    const duplicatedProduct = await Product.findOne({ where: { name } });
    if (duplicatedProduct) {
      removeUploadedImages(images);

      return errorResponse(res, 409, "این محصول قبلا ثبت شده است.");
    }

    const newProduct = await Product.create({
      name,
      description,
      specifications,
      price,
      stock,
      categoryId,
      images,
    });

    return successResponse(
      res,
      201,
      "محصول جدید با موفقیت اضافه شد.",
      newProduct
    );
  } catch (error) {
    removeUploadedImages(images);
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { error } = paginationQuerySchema.validate(req.query);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
      attributes: { exclude: ["password"] },
    });
    if (count === 0) {
      return errorResponse(res, 404, "هیچ محصولی یافت نشد.");
    }

    const pagination = createPagination(page, limit, count, "Products");

    return successResponse(res, 200, { products: rows, pagination });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = IdParamSchema.validate(req.params);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const product = await Product.findByPk(id, { raw: true });

    if (!product) {
      return errorResponse(res, 404, "محصولی یافت نشد.");
    }

    return successResponse(res, 200, product);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = IdParamSchema.validate(req.params);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 404, "محصولی یافت نشد.");
    }

    removeUploadedImages(product.images);

    await Product.destroy({ where: { id } });

    return successResponse(res, 200, "محصول مورد نظر با موفقیت حذف گردید.");
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    let { name, description, specifications, price, stock, categoryId } =
      req.body;

    if (specifications) specifications = JSON.parse(specifications);

    const product = await Product.findByPk(id);

    let newImages;
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(
        (img) => `public/images/products/${img.filename}`
      );

      //? The `if (!product)` condition is repeated twice intentionally to prevent images from being uploaded in case of an error. This ensures that uploaded files are removed immediately if the product is not found.

      if (!product) {
        removeUploadedImages(newImages);

        return errorResponse(res, 404, "محصول یافت نشد");
      }

      product.images = [...(product.images || []), ...newImages];
    }

    if (!product) {
      removeUploadedImages(newImages);

      return errorResponse(res, 404, "محصول یافت نشد");
    }

    if (name) product.name = name;

    if (description) product.description = description;

    if (specifications) product.specifications = specifications;

    if (price) product.price = price;

    if (stock) product.stock = stock;

    if (categoryId) {
      const categoryIdExist = await Category.findByPk(categoryId);
      if (!categoryIdExist) {
        return errorResponse(res, 404, "دسته بندی با این شناسه یافت نشد.");
      }

      product.categoryId = categoryId;
    }

    const { error: paramError } = IdParamSchema.validate(req.params);
    if (paramError) {
      removeUploadedImages(newImages);

      return errorResponse(res, 409, paramError.details[0].message);
    }

    const { error: bodyError } = updateProductSchema.validate(
      {
        name,
        description,
        price,
        stock,
        categoryId,
        specifications,
      },
      { abortEarly: false }
    );
    if (bodyError) {
      removeUploadedImages(newImages);

      return errorResponse(res, 400, { error: bodyError.details[0].message });
    }

    await product.save();

    return successResponse(
      res,
      200,
      "محصول مورد نظر با موفقیت بروزرسانی گردید."
    );
  } catch (error) {
    next(error);
  }
};

exports.removeImages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { imagesToRemove } = req.body;

    const { error } = IdParamSchema.validate(req.params);
    if (error) {
      return errorResponse(res, 409, error.details[0].message);
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return errorResponse(res, 404, "محصول یافت نشد.");
    }

    const remainingImages = product.images.filter((img) => {
      return !imagesToRemove.includes(img);
    });

    imagesToRemove.forEach((imgPath) => {
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });

    product.images = remainingImages;
    await product.save();

    return successResponse(res, 200, "تصاویر با موفقیت حذف شدند.");
  } catch (error) {
    next(error);
  }
};
