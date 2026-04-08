import { baseSchema } from "./baseSchema.ts";
import { authSchema } from "./authSchema.ts";
import { userSchema } from "./userSchema.ts";
import { foodSchema } from "./foodSchema.ts";
import { tableSchema } from "./tableSchema.ts";

export const typeDefs = `#graphql
${baseSchema}
${authSchema}
${userSchema}
${foodSchema}
${tableSchema}
`;
