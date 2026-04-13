export interface BookingAttributes {
  id?: string;
  tableId: string;
  userId: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
