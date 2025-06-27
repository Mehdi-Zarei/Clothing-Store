const Joi = require("joi");

const addToCartSchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "any.required": "شناسه محصول الزامی است.",
    "number.base": "شناسه محصول باید عدد باشد.",
    "number.integer": "شناسه محصول باید عدد صحیح باشد.",
    "number.positive": "شناسه محصول باید عددی مثبت باشد.",
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.base": "تعداد باید عدد باشد.",
    "number.integer": "تعداد باید عدد صحیح باشد.",
    "number.min": "تعداد باید حداقل ۱ باشد.",
  }),
});

const removeFromCartSchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "any.required": "شناسه محصول الزامی است.",
    "number.base": "شناسه محصول باید عدد باشد.",
    "number.integer": "شناسه محصول باید عدد صحیح باشد.",
    "number.positive": "شناسه محصول باید عددی مثبت باشد.",
  }),
});

module.exports = { addToCartSchema, removeFromCartSchema };
