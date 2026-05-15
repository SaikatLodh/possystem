import Joi from "joi";

export const createLectureValidation = ({
  fullname,
  email,
  password,
  number,
}: {
  fullname: string;
  email: string;
  password: string;
  number: string;
}) => {
  const schema = Joi.object({
    fullname: Joi.string().required().trim().min(3).max(50).messages({
      "string.base": "Full name must be a text value",
      "string.empty": "Full name is required",
      "any.required": "Full name field cannot be empty",
      "string.min": "Full name must be at least 3 characters long",
      "string.max": "Full name must be at most 50 characters long",
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .trim()
      .messages({
        "string.base": "Email must be a text value",
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email address",
        "any.required": "Email field cannot be empty",
      }),
    password: Joi.string().required().trim().min(6).max(30).messages({
      "string.base": "Password must be a text value",
      "string.empty": "Password is required",
      "any.required": "Password field cannot be empty",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must be at most 30 characters long",
    }),
    number: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be a 10-digit number",
        "string.empty": "Phone number is required",
        "string.base": "Phone number must be a 10-digit number",
        "any.required": "Phone number field cannot be empty",
      }),
  });

  return schema.validate(
    { fullname, email, password, number },
    { abortEarly: false },
  );
};
