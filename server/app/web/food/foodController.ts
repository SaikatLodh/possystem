import { Op } from "sequelize";
import Food from "../../models/foodModel.ts";
import STATUS_CODES from "../../config/httpStatusCode.ts";
import logger from "../../helpers/logger.ts";
import { saveAndUploadFile } from "../../helpers/fileUpload.ts";
import { generateUniqueSlug } from "../../helpers/slug.ts";
import {
  createFoodValidation,
  updateFoodValidation,
} from "../../helpers/validator/food/foofValidator.ts";

class FoodController {
  async createFood({
    name,
    description,
    price,
    category,
    file,
  }: {
    name: string;
    description: string;
    price: number;
    category: string;
    file?: {
      filename: string;
      mimetype: string;
      encoding: string;
      data: string;
    };
  }) {
    try {
      const { error } = createFoodValidation(
        name,
        description,
        price,
        category,
        file,
      );

      if (error) {
        logger.error(error?.details[0]?.message);
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: error?.details[0]?.message,
        };
      }

      const slug = await generateUniqueSlug(name);

      if (!slug) {
        logger.error("Slug generation failed");
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Slug generation failed",
        };
      }

      if (file && file.data) {
        const uploadedFile = await saveAndUploadFile(file);

        if (!uploadedFile) {
          logger.error("File upload failed");
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "File upload failed",
          };
        }

        const food = await Food.create({
          name,
          description,
          price,
          category,
          slug,
          image: uploadedFile,
        });

        if (!food) {
          logger.error("Food creation failed");
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Food creation failed",
          };
        }
      } else {
        const food = await Food.create({
          name,
          description,
          price,
          category,
          slug,
        });

        if (!food) {
          logger.error("Food creation failed");
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Food creation failed",
          };
        }
      }
      logger.info("Food created successfully");
      return {
        status: STATUS_CODES.CREATED,
        message: "Food created successfully",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }
  async getFoods({
    page = 1,
    limit = 10,
    search,
    category,
    sortBy = "createdAt",
    sortOrder = "DESC",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) {
    try {
      const offset = (page - 1) * limit;
      const where: any = { isDeleted: false };

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      if (category) {
        where.category = category;
      }

      const { count, rows: foods } = await Food.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
      });

      const totalPages = Math.ceil(count / limit);

      logger.info("Foods fetched successfully");
      return {
        status: STATUS_CODES.OK,
        message: "success",
        foods,
        pagination: {
          totalItems: count,
          totalPages,
          currentPage: page,
          limit,
        },
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async getFood(id: string) {
    try {
      const food = await Food.findByPk(id);

      if (!food) {
        logger.error("Food not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Food not found",
        };
      }
      logger.info("Food fetched successfully");
      return {
        status: STATUS_CODES.OK,
        message: "success",
        food,
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async updateFood({
    id,
    name,
    description,
    price,
    category,
    file,
  }: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    file?: {
      filename: string;
      mimetype: string;
      encoding: string;
      data: string;
    };
  }) {
    try {
      const { error } = updateFoodValidation(
        id,
        name,
        description,
        price,
        category,
        file,
      );

      if (error) {
        logger.error(error?.details[0]?.message);
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: error?.details[0]?.message,
        };
      }

      const findFood = await Food.findByPk(id);

      if (!findFood) {
        logger.error("Food not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Food not found",
        };
      }

      if (name !== findFood.name) {
        const updatedSlugValue = await generateUniqueSlug(name);
        if (!updatedSlugValue) {
          logger.error("Slug generation failed");
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "Slug generation failed",
          };
        }
        findFood.slug = updatedSlugValue;
      }

      if (file && file.data) {
        const uploadedFile = await saveAndUploadFile(file);

        if (!uploadedFile) {
          logger.error("File upload failed");
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "File upload failed",
          };
        }

        findFood.image = uploadedFile;
      }

      findFood.name = name;
      findFood.description = description;
      findFood.price = price;
      findFood.category = category;
      await findFood.save({ validate: false });

      logger.info("Food updated successfully");
      return {
        status: STATUS_CODES.OK,
        message: "success",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async deleteFood(id: string) {
    try {
      const food = await Food.findByPk(id);

      if (!food) {
        logger.error("Food not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Food not found",
        };
      }

      const deleteFood = await Food.update(
        {
          isDeleted: true,
        },
        {
          where: {
            id,
          },
        },
      );

      if (!deleteFood) {
        logger.error("Food deletion failed");
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "Food deletion failed",
        };
      }

      logger.info("Food deleted successfully");
      return {
        status: STATUS_CODES.OK,
        message: "success",
      };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }
}

export default new FoodController();
