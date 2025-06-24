const { successResponse } = require("../../helpers/responseMessages");
const Product = require("../../models/Product");

exports.create = async (req, res, next) => {
  try {
    let { name, description, specifications, price, stock, categoryId } =
      req.body;

    if (specifications) specifications = JSON.parse(specifications);

    let images = [];

    if (req.files) {
      images = req.files.map(
        (images) => `public/images/products/${images.filename}`
      );
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
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.findAll();

    const formattedProducts = products.map((product) => {
      const plainProduct = product.toJSON();

      plainProduct.specifications = JSON.parse(plainProduct.specifications);

      plainProduct.images = JSON.parse(plainProduct.images);
      return plainProduct;
    });

    console.log(typeof products[0].specifications);
    console.log(typeof products[0].images);

    return successResponse(res, 200, formattedProducts);
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
