import Table from "../../models/tableModel.ts";
import STATUS_CODES from "../../config/httpStatusCode.ts";
import logger from "../../helpers/logger.ts";
import { createTableValidation } from "../../helpers/validator/table/tablevalidation.ts";

class TableController {
  async createTable({
    tableNumber,
    capacity,
  }: {
    tableNumber: number;
    capacity: number;
  }) {
    try {
      const { error } = createTableValidation(tableNumber, capacity);

      if (error) {
        logger.error(error?.details[0]?.message);
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: error?.details[0]?.message,
        };
      }

      const table = await Table.create({ tableNumber, capacity });

      if (!table) {
        logger.error("Table not created");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Table not created",
        };
      }
      logger.info("Table created successfully");
      return { status: STATUS_CODES.OK, message: "Table created successfully" };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async getTables() {
    try {
      const tables = await Table.findAll({ where: { isDeleted: false } });

      if (!tables) {
        logger.error("Tables not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Tables not found",
        };
      }
      logger.info("Tables fetched successfully");
      return { status: STATUS_CODES.OK, message: "success", tables };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async updateTable({
    id,
    capacity,
    tableNumber,
  }: {
    id: string;
    capacity: number;
    tableNumber: number;
  }) {
    try {
      const table = await Table.findByPk(id);
      if (!table) {
        logger.error("Table not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Table not found",
        };
      }

      const updateTable = await Table.update(
        { capacity, tableNumber },
        { where: { id } },
      );

      if (!updateTable) {
        logger.error("Table not updated");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Table not updated",
        };
      }
      logger.info("Table updated successfully");
      return { status: STATUS_CODES.OK, message: "Table updated successfully" };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async deleteTable({ id }: { id: string }) {
    try {
      const table = await Table.findByPk(id);
      if (!table) {
        logger.error("Table not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Table not found",
        };
      }

      const deleteTable = await Table.update(
        { isDeleted: true },
        { where: { id } },
      );

      if (!deleteTable) {
        logger.error("Table not deleted");
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Table not deleted",
        };
      }
      logger.info("Table deleted successfully");
      return { status: STATUS_CODES.OK, message: "Table deleted successfully" };
    } catch (error: any) {
      logger.error(error.message);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: error.message || "Internal Server Error",
      };
    }
  }

  async toggleTableStatus({ id }: { id: string }) {
    try {
      const table = await Table.findByPk(id);
      if (!table) {
        logger.error("Table not found");
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Table not found",
        };
      }

      if (table.status === "available") {
        const toggleTableStatus = await Table.update(
          { status: "unavailable" },
          { where: { id } },
        );

        if (!toggleTableStatus) {
          logger.error("Table status not toggled");
          return {
            status: STATUS_CODES.BAD_REQUEST,
            message: "Table status not toggled",
          };
        }
      } else {
        const toggleTableStatus = await Table.update(
          { status: "available" },
          { where: { id } },
        );

        if (!toggleTableStatus) {
          logger.error("Table status not toggled");
          return {
            status: STATUS_CODES.BAD_REQUEST,
            message: "Table status not toggled",
          };
        }
      }

      logger.info("Table status toggled successfully");
      return {
        status: STATUS_CODES.OK,
        message: "Table status toggled successfully",
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

export default new TableController();
