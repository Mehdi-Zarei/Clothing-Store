const Joi = require("joi");

const checkoutSchema = Joi.object({
  address: Joi.string().min(5).max(500).required().messages({
    "string.base": "آدرس باید رشته باشد.",
    "string.empty": "آدرس نمی‌تواند خالی باشد.",
    "string.min": "آدرس باید حداقل ۵ کاراکتر باشد.",
    "string.max": "آدرس نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد.",
    "any.required": "آدرس الزامی است.",
  }),
});

const verifyCheckoutSchema = Joi.object({
  Status: Joi.string().valid("OK", "NOK").required().messages({
    "any.only": "Status باید یکی از مقادیر OK یا NOK باشد.",
    "string.empty": "Status نمی‌تواند خالی باشد.",
    "any.required": "Status الزامی است.",
  }),
  Authority: Joi.string().min(1).required().messages({
    "string.empty": "Authority نمی‌تواند خالی باشد.",
    "any.required": "Authority الزامی است.",
  }),
});

module.exports = { verifyCheckoutSchema, checkoutSchema };
