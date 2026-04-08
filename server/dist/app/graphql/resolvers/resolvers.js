import { authResolvers } from "./authResolver.js";
import { userResolver } from "./userResolver.js";
export const resolvers = {
    Query: {
        ...userResolver.Query,
    },
    Mutation: {
        ...authResolvers.Mutation,
        ...userResolver.Mutation,
    },
};
//# sourceMappingURL=resolvers.js.map