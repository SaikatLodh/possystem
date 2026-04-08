import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema/schema.ts";
import { resolvers } from "./resolvers/resolvers.ts";

export const connectGraphql = () => {
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });
  return server;
};

export default connectGraphql;
