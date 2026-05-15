import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import type { CartItem } from "../../interface";
import Invoice from "./Invoice";
import { useQlMutation } from "../../graphql/globalRequest";
import { makePayment, verifyPayment, getRazorpayKeys } from "../../graphql/query/payment";
import { loadRazorpayScript } from "../../payment";
import { useAppSelector } from "../../store/hook";
import type { RootState } from "../../store/store";
import useQlQuery from "../../graphql/globalRequest";
import { CART_ITEMS, FOODS, KEY, TABLES, USER_BOOKINGS } from "../../tanstackKeys";
import { useQueryClient } from "@tanstack/react-query";

const Bill = ({ cartItems, bookingId, tableId }: { cartItems: CartItem[], bookingId: string, tableId: string }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>();

  const subtotal = cartItems.reduce((acc: number, item: any) => acc + (item.quantity * item?.food?.price), 0);
  const tax = (subtotal * 5.25) / 100;
  const totalPriceWithTax = subtotal + tax;

  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Online">("Cash");

  const user = useAppSelector((state: RootState) => state.auth.user);

  // Hooks — must be called at the top level of the component
  const { mutate: createPaymentOrder, isPending: isCreatingOrder } = useQlMutation(makePayment);
  const { mutate: confirmPayment, isPending: isConfirmingPayment } = useQlMutation(verifyPayment);
  const { data: keyData } = useQlQuery(KEY, getRazorpayKeys);

  const foodsId = cartItems.map((item: CartItem) => item.food.id);

  const queryClient = useQueryClient()

  // ── CASH ──────────────────────────────────────────────────────────────────
  const handleCashPayment = () => {
    setIsLoading(true);
    createPaymentOrder(
      {
        bookingId,
        tableId,
        foodsId,
        amount: totalPriceWithTax,
        paymentMethod: "cash",
      },
      {
        onSuccess: (res: any) => {
          const result = res?.makePayment;
          if (result?.status === 200) {
            enqueueSnackbar("Cash payment recorded successfully!", { variant: "success" });
            setOrderInfo(result);
            setShowInvoice(true);
            queryClient.invalidateQueries({ queryKey: [TABLES] })
            queryClient.invalidateQueries({ queryKey: [FOODS] })
            queryClient.invalidateQueries({ queryKey: [CART_ITEMS] })
            queryClient.invalidateQueries({ queryKey: [USER_BOOKINGS] })
          } else {
            enqueueSnackbar(result?.message || "Cash payment failed!", { variant: "error" });
          }
          setIsLoading(false);
        },
        onError: (err: any) => {
          enqueueSnackbar(err?.message || "Cash payment failed!", { variant: "error" });
          setIsLoading(false);
        },
      }
    );
  };

  // ── ONLINE ────────────────────────────────────────────────────────────────
  const handleOnlinePayment = async () => {
    setIsLoading(true);

    // 1. Load Razorpay checkout script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      enqueueSnackbar("Razorpay SDK failed to load. Are you online?", { variant: "warning" });
      setIsLoading(false);
      return;
    }

    // 2. Create Razorpay order via backend
    createPaymentOrder(
      {
        bookingId,
        tableId,
        foodsId,
        amount: totalPriceWithTax,
        paymentMethod: "online",
      },
      {
        onSuccess: async (res: any) => {
          const result = res?.makePayment;
          if (result?.status !== 200) {
            enqueueSnackbar(result?.message || "Failed to create payment order!", { variant: "error" });
            setIsLoading(false);
            return;
          }

          const { createRazorpayorder, paymentId } = result.data;
          const razorpayKey = (keyData as any)?.getKeys?.data?.key;

          // 3. Open Razorpay checkout
          const options = {
            key: razorpayKey,
            amount: createRazorpayorder.amount,
            currency: createRazorpayorder.currency,
            name: "RESTRO",
            description: "Secure Payment for Your Meal",
            order_id: createRazorpayorder.id,

            // 4. On successful payment → verify with backend
            handler: async (response: {
              razorpay_payment_id: string;
              razorpay_order_id: string;
              razorpay_signature: string;
            }) => {
              confirmPayment(
                {
                  paymentId,
                  tableId,
                  foodsId,
                  bookingId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  onSuccess: (verifyRes: any) => {
                    const verifyResult = verifyRes?.verifyPayment;
                    if (verifyResult?.status === 200) {
                      enqueueSnackbar("Online payment verified successfully!", { variant: "success" });
                      setOrderInfo(verifyResult);
                      setShowInvoice(true);
                    } else {
                      enqueueSnackbar(verifyResult?.message || "Payment verification failed!", { variant: "error" });
                    }
                    setIsLoading(false);
                  },
                  onError: (err: any) => {
                    enqueueSnackbar(err?.message || "Payment verification failed!", { variant: "error" });
                    setIsLoading(false);
                  },
                }
              );
            },

            prefill: {
              name: user?.fullname || "",
              email: user?.email || "",
            },
            theme: { color: "#025cca" },
            modal: {
              ondismiss: () => {
                enqueueSnackbar("Payment cancelled.", { variant: "warning" });
                setIsLoading(false);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        },
        onError: (err: any) => {
          enqueueSnackbar(err?.message || "Failed to create payment order!", { variant: "error" });
          setIsLoading(false);
        },
      }
    );
  };

  // ── MAIN HANDLER ──────────────────────────────────────────────────────────
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      enqueueSnackbar("Your cart is empty!", { variant: "warning" });
      return;
    }

    if (paymentMethod === "Cash") {
      handleCashPayment();
    } else {
      handleOnlinePayment();
    }
  };

  const isBusy = isLoading || isCreatingOrder || isConfirmingPayment;

  return (
    <>
      <div className="mt-2 mb-4">
        <div className="flex items-center justify-between px-5">
          <p className="text-xs text-[#ababab] font-medium">
            Items({cartItems.length})
          </p>
          <h1 className="text-[#f5f5f5] text-md font-bold">
            ₹{subtotal.toFixed(2)}
          </h1>
        </div>
        <div className="flex items-center justify-between px-5 mt-2">
          <p className="text-xs text-[#ababab] font-medium mt-2">Tax(5.25%)</p>
          <h1 className="text-[#f5f5f5] text-md font-bold">₹{tax.toFixed(2)}</h1>
        </div>
        <div className="flex items-center justify-between px-5 mt-2">
          <p className="text-xs text-[#ababab] font-medium mt-2">
            Total With Tax
          </p>
          <h1 className="text-[#f5f5f5] text-md font-bold">
            ₹{totalPriceWithTax.toFixed(2)}
          </h1>
        </div>
        <div className="flex items-center gap-3 px-5 mt-4">
          <button
            onClick={() => setPaymentMethod("Cash")}
            className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] cursor-pointer font-semibold ${paymentMethod === "Cash" ? "bg-[#383737]" : ""
              }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMethod("Online")}
            className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] cursor-pointer font-semibold ${paymentMethod === "Online" ? "bg-[#383737]" : ""
              }`}
          >
            Online
          </button>
        </div>

        <div className="flex items-center gap-3 px-5 mt-4">
          <button className="bg-[#025cca] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-lg cursor-pointer">
            Print Receipt
          </button>
          <button
            onClick={handlePlaceOrder}
            className="bg-[#f6b100] px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg cursor-pointer disabled:opacity-60"
            disabled={isBusy}
          >
            {isBusy ? "Processing..." : "Place Order"}
          </button>
        </div>

        {/* {showInvoice && (
          <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
        )} */}
      </div>
    </>
  );
};


export default Bill;
