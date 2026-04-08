export interface SelectOrdersAttributes {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: { publicId: string; url: string } | null;
  publicId: string;
  url: string;
  slug?: Promise<string> | string;
  numberOfOrders?: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
