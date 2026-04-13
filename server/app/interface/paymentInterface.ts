export interface PaymentAttributes {
    id?: string;
    bookingId: string;
    userId: string;
    amount: number;
    paymentMethod?: string;
    paymentStatus?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}