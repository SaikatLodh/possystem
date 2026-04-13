import { baseSchema } from "./baseSchema.ts";
import { authSchema } from "./authSchema.ts";
import { userSchema } from "./userSchema.ts";
import { foodSchema } from "./foodSchema.ts";
import { tableSchema } from "./tableSchema.ts";
import { bookingSchema } from "./bookingSchema.ts";
import { adminSchema } from "./adminSchema.ts";
import { paymentSchema } from "./paymentSchema.ts";

export const typeDefs = `#graphql
${baseSchema}
${authSchema}
${userSchema}
${foodSchema}
${tableSchema}
${bookingSchema}
${adminSchema}
${paymentSchema}
`;
