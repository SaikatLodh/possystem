import { withAuth } from "../../middleware/authUtils.js";
import userController from "../../web/user/userController.js";
export const userResolver = {
    Query: {
        getUser: withAuth((_, args, context) => {
            return userController.getUsers(context?.req?.user?.id);
        }),
    },
    Mutation: {
        updateUser: withAuth((_, args, context) => {
            return userController.updateUser(context?.req?.user?.id, args.fullname, args.file);
        }),
        changePassword: withAuth((_, args, context) => {
            return userController.changePassword(context?.req?.user?.id, args.oldPassword, args.confirmPassword, args.password);
        }),
    },
};
//# sourceMappingURL=userResolver.js.map