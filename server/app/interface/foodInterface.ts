export default interface FoodAttributes {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: { publicId: string; url: string } | null;
  slug?: string | null;
  numberOfOrders?: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
