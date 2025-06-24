const Joi = require("joi");

const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    "number.base": "page باید یک عدد باشد.",
    "number.min": "page باید حداقل 1 باشد.",
    "number.integer": "page باید عدد صحیح باشد.",
  }),
  limit: Joi.number().integer().min(1).optional().messages({
    "number.base": "limit باید یک عدد باشد.",
    "number.min": "limit باید حداقل 1 باشد.",
    "number.integer": "limit باید عدد صحیح باشد.",
  }),
});

const userIdParamSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    "number.base": "شناسه کاربر باید یک عدد باشد.",
    "number.integer": "شناسه کاربر باید عدد صحیح باشد.",
    "number.min": "شناسه کاربر باید بزرگتر از صفر باشد.",
    "any.required": "شناسه کاربر الزامی است.",
  }),
});

module.exports = { paginationQuerySchema, userIdParamSchema };
