export interface BookingAttributes {
  id?: string;
  tableId: string;
  userId: string;
  paymentStatus?: "paid" | "unpaid" | "pending";
  confirmStatus?: "confirmed" | "not confirmed" | "pending";
  confirmBy?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
