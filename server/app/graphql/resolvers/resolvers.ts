import { authResolvers } from "./authResolver.ts";
import { userResolver } from "./userResolver.ts";
import { foodResolver } from "./foodResolver.ts";
import { tableResolvers } from "./tableResolver.ts";
import { bookResolvers } from "./bookResolvers.ts";
import { adminResolvers } from "./adminResolvers.ts";
import { paymentResolvers } from "./paymentResolver.ts";

export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...foodResolver.Query,
    ...tableResolvers.Query,
    ...bookResolvers.Query,
    ...adminResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolver.Mutation,
    ...foodResolver.Mutation,
    ...tableResolvers.Mutation,
    ...bookResolvers.Mutation,
    ...paymentResolvers.Mutation,
  },
};
