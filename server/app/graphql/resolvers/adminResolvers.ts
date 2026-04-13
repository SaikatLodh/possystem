import adminController from "../../web/admin/adminController.ts";

export const adminResolvers = {
    Query: {
        dashboardData: () => adminController.dashboardData(),
    },

};

