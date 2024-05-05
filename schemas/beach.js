const Joi = require("joi");

module.exports.beachSchema = Joi.object({
  beach: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    cost: Joi.number().min(0).required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
});
