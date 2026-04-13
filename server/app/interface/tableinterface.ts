export default interface TableAttributes {
  id?: string;
  tableNumber: number;
  status?: "available" | "unavailable";
  capacity: number;
  isDeleted?: boolean;
  createdAt?: "createdAt";
  updatedAt?: "updatedAt";
}
