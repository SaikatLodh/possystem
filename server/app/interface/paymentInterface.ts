export interface PaymentAttributes {
    id?: string;
    bookingId: string;
    userId: string;
    amount: number;
    paymentMethod: "cash" | "card" | "upi";
    paymentStatus?: "pending" | "paid" | "failed";
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}