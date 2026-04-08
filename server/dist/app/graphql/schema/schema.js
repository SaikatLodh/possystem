import { baseSchema } from "./baseSchema.js";
import { authSchema } from "./authSchema.js";
import { userSchema } from "./userSchema.js";
export const typeDefs = `#graphql
${baseSchema}
${authSchema}
${userSchema}
`;
//# sourceMappingURL=schema.js.map