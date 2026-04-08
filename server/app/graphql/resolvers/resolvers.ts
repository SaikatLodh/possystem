import { authResolvers } from "./authResolver.ts";
import { userResolver } from "./userResolver.ts";
import { foodResolver } from "./foodResolver.ts";
import { tableResolvers } from "./tableResolver.ts";

export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...foodResolver.Query,
    ...tableResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolver.Mutation,
    ...foodResolver.Mutation,
    ...tableResolvers.Mutation,
  },
};
