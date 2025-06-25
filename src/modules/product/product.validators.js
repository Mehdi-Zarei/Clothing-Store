const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "نام باید از نوع رشته باشد.",
    "string.empty": "نام الزامی است.",
    "any.required": "وارد کردن نام محصول الزامی است.",
  }),

  description: Joi.string().required().messages({
    "string.base": "توضیحات باید از نوع رشته باشد.",
    "string.empty": "توضیحات الزامی است.",
    "any.required": "وارد کردن توضیحات الزامی است.",
  }),

  price: Joi.number().required().messages({
    "number.base": "قیمت باید عددی باشد.",
    "any.required": "وارد کردن قیمت الزامی است.",
  }),

  stock: Joi.number().required().messages({
    "number.base": "موجودی باید عددی باشد.",
    "any.required": "وارد کردن موجودی الزامی است.",
  }),

  categoryId: Joi.number().required().messages({
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
    .required()
    .messages({
      "any.required": "وارد کردن مشخصات (specifications) الزامی است.",
    }),
});

module.exports = { productSchema };
