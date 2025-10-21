import Joi from "joi";

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email cannot be empty!",
    "string.email": "Email format is invalid!",
    "any.required": "Email is required!",
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "string.empty": "Token cannot be empty!",
    "any.required": "Token is required!",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password cannot be empty!",
    "string.min": "Password must be at least 6 characters long!",
    "any.required": "Password is required!",
  }),
});
