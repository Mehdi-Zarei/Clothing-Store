const Joi = require("joi");

const categoryIdParamSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    "number.base": "شناسه دسته بندی باید یک عدد باشد.",
    "number.integer": "شناسه دسته بندی باید عدد صحیح باشد.",
    "number.min": "شناسه دسته بندی باید بزرگتر از صفر باشد.",
    "any.required": "شناسه دسته بندی الزامی است.",
  }),
});

const categorySchema = Joi.object({
  title: Joi.string()
    .pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "عنوان فقط باید شامل حروف فارسی یا انگلیسی باشد (بدون عدد).",
      "string.empty": "عنوان الزامی است.",
    }),

  slug: Joi.string()
    .pattern(/^[a-zA-Z\-]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "اسلاگ فقط باید شامل حروف انگلیسی و خط تیره (-) باشد (بدون عدد).",
      "string.empty": "اسلاگ الزامی است.",
    }),
});

const updateCategorySchema = Joi.object({
  title: Joi.string()
    .pattern(/^[\u0600-\u06FFa-zA-Z\s]+$/)
    .messages({
      "string.pattern.base":
        "عنوان فقط باید شامل حروف فارسی یا انگلیسی باشد (بدون عدد).",
      "string.empty": "عنوان الزامی است.",
    }),

  slug: Joi.string()
    .pattern(/^[a-zA-Z\-]+$/)
    .messages({
      "string.pattern.base":
        "اسلاگ فقط باید شامل حروف انگلیسی و خط تیره (-) باشد (بدون عدد).",
      "string.empty": "اسلاگ الزامی است.",
    }),
});

module.exports = {
  categoryIdParamSchema,
  categorySchema,
  updateCategorySchema,
};
