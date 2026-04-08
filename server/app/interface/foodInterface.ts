export default interface FoodAttributes {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: { publicId: string; url: string } | null;
  slug?: Promise<string> | string;
  numberOfOrders?: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
