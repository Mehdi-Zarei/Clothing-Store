const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "نام باید از نوع رشته باشد.",
    "string.empty": "نام الزامی است.",
    "any.required": "وارد کردن نام محصول الزامی است.",
  }),

  description: Joi.string().messages({
    "string.base": "توضیحات باید از نوع رشته باشد.",
    "string.empty": "توضیحات الزامی است.",
    "any.required": "وارد کردن توضیحات الزامی است.",
  }),

  price: Joi.number().messages({
    "number.base": "قیمت باید عددی باشد.",
    "any.required": "وارد کردن قیمت الزامی است.",
  }),

  stock: Joi.number().messages({
    "number.base": "موجودی باید عددی باشد.",
    "any.required": "وارد کردن موجودی الزامی است.",
  }),

  categoryId: Joi.number().messages({
    "number.base": "شناسه دسته‌بندی باید عددی باشد.",
    "any.required": "وارد کردن دسته‌بندی الزامی است.",
  }),

  specifications: Joi.alternatives()
    .try(
      Joi.string().custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);

          const specSchema = Joi.object({
            size: Joi.array().items(Joi.string()).messages({
              "array.base": "فیلد سایز باید آرایه‌ای از رشته‌ها باشد.",
            }),
            material: Joi.string(),
            dimensions: Joi.string(),
            gender: Joi.string(),
            brand: Joi.string(),
          });

          const { error } = specSchema.validate(parsed);
          if (error) throw error;

          return parsed;
        } catch (err) {
          return helpers.message("ساختار فیلد specifications نامعتبر است.");
        }
      }),
      Joi.object({
        size: Joi.array().items(Joi.string()),
        material: Joi.string(),
        dimensions: Joi.string(),
        gender: Joi.string(),
        brand: Joi.string(),
      })
    )

    .messages({
      "any.required": "وارد کردن مشخصات (specifications) الزامی است.",
    }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().messages({
    "string.base": "نام باید از نوع رشته باشد.",
  }),

  description: Joi.string().messages({
    "string.base": "توضیحات باید از نوع رشته باشد.",
  }),

  price: Joi.number().messages({
    "number.base": "قیمت باید عددی باشد.",
  }),

  stock: Joi.number().messages({
    "number.base": "موجودی باید عددی باشد.",
  }),

  categoryId: Joi.number().messages({
    "number.base": "شناسه دسته‌بندی باید عددی باشد.",
  }),

  specifications: Joi.alternatives()
    .try(
      Joi.string().custom((value, helpers) => {
        try {
          const parsed = JSON.parse(value);

          const specSchema = Joi.object({
            size: Joi.array().items(Joi.string()).messages({
              "array.base": "فیلد سایز باید آرایه‌ای از رشته‌ها باشد.",
            }),
            material: Joi.string(),
            dimensions: Joi.string(),
            gender: Joi.string(),
            brand: Joi.string(),
          });

          const { error } = specSchema.validate(parsed);
          if (error) throw error;

          return parsed;
        } catch (err) {
          return helpers.message("ساختار فیلد specifications نامعتبر است.");
        }
      }),
      Joi.object({
        size: Joi.array().items(Joi.string()),
        material: Joi.string(),
        dimensions: Joi.string(),
        gender: Joi.string(),
        brand: Joi.string(),
      })
    )

    .messages({
      "any.required": "وارد کردن مشخصات (specifications) الزامی است.",
    }),
});

const IdParamSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    "number.base": "شناسه محصول باید یک عدد باشد.",
    "number.integer": "شناسه محصول باید عدد صحیح باشد.",
    "number.min": "شناسه محصول باید بزرگتر از صفر باشد.",
    "any.required": "شناسه محصول الزامی است.",
  }),
});

const removeImagesSchema = Joi.object({
  imagesToRemove: Joi.array()
    .items(
      Joi.string()
        .pattern(/^public\/images\/products\/[\w\-]+\.(jpg|jpeg|png|webp)$/)
        .required()
    )
    .min(1)
    .required()
    .messages({
      "array.base": "imagesToRemove باید یک آرایه باشد.",
      "array.min": "حداقل باید یک تصویر برای حذف انتخاب شود.",
      "any.required": "فیلد imagesToRemove الزامی است.",
      "string.pattern.base":
        "فرمت مسیر تصویر معتبر نیست. باید مانند public/images/products/filename.jpg باشد.",
    }),
});

module.exports = {
  productSchema,
  updateProductSchema,
  IdParamSchema,
  removeImagesSchema,
};
