export const ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  WAITER: "waiter",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
