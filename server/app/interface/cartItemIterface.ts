export interface cartItemAttributes {
  id?: string;
  userId: string;
  foodId: string;
  quantity: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}