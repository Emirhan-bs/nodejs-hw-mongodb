const Joi = require("joi");
const base = {
  name: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  phone: Joi.string().min(3).max(20),
  contactType: Joi.string().min(3).max(20),
  isFavorite: Joi.string().min(3).max(20),
};
const createContactSchema = Joi.object({
  name: base.name.required(),
  email: base.email.required(),
  phone: base.phone.required(),
  contactType: base.contactType.optional(),
  isFavorite: base.isFavorite.optional(),
});
const updateContactSchema = Joi.object({
  name: base.name,
  email: base.email,
  phone: base.phone,
  contactType: base.contactType,
  isFavourite: base.isFavourite,
}).min(1);

module.exports = {
  createContactSchema,
  updateContactSchema,
};
