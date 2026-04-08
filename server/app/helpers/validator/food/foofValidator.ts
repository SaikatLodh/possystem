import Joi from "joi";

export const createFoodValidation = (
  name: string,
  description: string,
  price: number,
  category: string,
  file?: {
    filename: string;
    mimetype: string;
    encoding: string;
    data: string;
  } | null,
) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(6).max(60).messages({
      "string.base": "Name must be a text value",
      "string.empty": "Name is required",
      "any.required": "Name field cannot be empty",
      "string.min": "Name must be at least 6 characters long",
      "string.max": "Name must be at most 60 characters long",
    }),
    description: Joi.string().required().trim().min(10).max(200).messages({
      "string.base": "Description must be a text value",
      "string.empty": "Description is required",
      "any.required": "Description field cannot be empty",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description must be at most 200 characters long",
    }),
    price: Joi.number().precision(2).required().min(1).messages({
      "number.base": "Price must be a number",
      "number.empty": "Price is required",
      "any.required": "Price field cannot be empty",
      "number.min": "Price must be at least 1",
      "number.precision": "Price can have at most 2 decimal places",
    }),
    category: Joi.string().required().trim().min(3).max(50).messages({
      "string.base": "Category must be a text value",
      "string.empty": "Category is required",
      "any.required": "Category field cannot be empty",
      "string.min": "Category must be at least 3 characters long",
      "string.max": "Category must be at most 50 characters long",
    }),
    file: Joi.object().optional().messages({
      "object.base": "File must be an object",
      "object.empty": "File is required",
      "any.required": "File field cannot be empty",
    }),
  });

  return schema.validate(
    { name, description, price, category, file },
    {
      abortEarly: false,
    },
  );
};

export const updateFoodValidation = (
  id: string,
  name: string,
  description: string,
  price: number,
  category: string,
  file?: {
    filename: string;
    mimetype: string;
    encoding: string;
    data: string;
  } | null,
) => {
  const schema = Joi.object({
    id: Joi.string().required().trim().messages({
      "string.base": "ID must be a text value",
      "string.empty": "ID is required",
      "any.required": "ID field cannot be empty",
    }),
    name: Joi.string().required().trim().min(6).max(60).messages({
      "string.base": "Name must be a text value",
      "string.empty": "Name is required",
      "any.required": "Name field cannot be empty",
      "string.min": "Name must be at least 6 characters long",
      "string.max": "Name must be at most 60 characters long",
    }),
    description: Joi.string().required().trim().min(10).max(200).messages({
      "string.base": "Description must be a text value",
      "string.empty": "Description is required",
      "any.required": "Description field cannot be empty",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description must be at most 200 characters long",
    }),
    price: Joi.number().precision(2).required().min(1).messages({
      "number.base": "Price must be a number",
      "number.empty": "Price is required",
      "any.required": "Price field cannot be empty",
      "number.min": "Price must be at least 1",
      "number.precision": "Price can have at most 2 decimal places",
    }),
    category: Joi.string().required().trim().min(3).max(50).messages({
      "string.base": "Category must be a text value",
      "string.empty": "Category is required",
      "any.required": "Category field cannot be empty",
      "string.min": "Category must be at least 3 characters long",
      "string.max": "Category must be at most 50 characters long",
    }),
    file: Joi.object().optional().messages({
      "object.base": "File must be an object",
      "object.empty": "File is required",
      "any.required": "File field cannot be empty",
    }),
  });

  return schema.validate(
    { name, description, price, category, file },
    {
      abortEarly: false,
    },
  );
};
