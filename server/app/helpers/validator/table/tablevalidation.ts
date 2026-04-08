import Joi from "joi";

export const createTableValidation = (tableNumber: number, capacity: number) => {
  const schema = Joi.object({
    tableNumber: Joi.number().required().min(1).messages({
      "number.base": "Table number must be a number",
      "number.empty": "Table number is required",
      "any.required": "Table number field cannot be empty",
      "number.min": "Table number must be at least 1",
    }),
    capacity: Joi.number().required().min(1).messages({
      "number.base": "Capacity must be a number",
      "number.empty": "Capacity is required",
      "any.required": "Capacity field cannot be empty",
      "number.min": "Capacity must be at least 1",
    }),
  });
  return schema.validate({ tableNumber, capacity }, { abortEarly: false });
};
