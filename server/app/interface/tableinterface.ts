export default interface TableAttributes {
  id?: string;
  tableNumber: number;
  status?: "available" | "unavailable";
  capacity: number;
  isDeleted?: boolean;
  confirmedByWaiters?: Array<string>;
  createdAt?: "createdAt";
  updatedAt?: "updatedAt";
}
