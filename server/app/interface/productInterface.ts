export default interface ProductAttributes {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
