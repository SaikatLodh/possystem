import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema/schema.ts";
import { resolvers } from "./resolvers/resolvers.ts";
import type GraphQLContext from "../interface/contextType.ts";

export const connectGraphql = () => {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });
  return server;
};

export default connectGraphql;
