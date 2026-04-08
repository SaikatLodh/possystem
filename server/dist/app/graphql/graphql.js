import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./schema/schema.js";
import { resolvers } from "./resolvers/resolvers.js";
export const connectGraphql = () => {
    const server = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
    });
    return server;
};
export default connectGraphql;
//# sourceMappingURL=graphql.js.map