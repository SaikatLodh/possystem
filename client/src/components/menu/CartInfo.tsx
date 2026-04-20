import { useEffect, useRef } from "react";
import type { CartItem } from "../../interface";
import { MdDeleteOutline, MdOutlineShoppingCart } from "react-icons/md";
import { IoAdd, IoRemove } from "react-icons/io5";
import { enqueueSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useQlMutation } from "../../graphql/globalRequest";
import { decreaseCartItemQuantity, deleteCartItem, increaseCartItemQuantity } from "../../graphql/query/cartItem";
import { CART_ITEMS } from "../../tanstackKeys";



const CartInfo = ({ cartItems, isLoading }: { cartItems: CartItem[], isLoading: boolean }) => {
  const scrolLRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrolLRef.current) {
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartItems]);

  const queryClient = useQueryClient();


  const { mutate: increaseQty } = useQlMutation(increaseCartItemQuantity);
  const { mutate: decreaseQty } = useQlMutation(decreaseCartItemQuantity);
  const { mutate: removeItem } = useQlMutation(deleteCartItem);

  const subtotal = cartItems.reduce((acc: number, item: any) => acc + (item.quantity * item?.food?.price), 0);

  const handleUpdateQuantity = (id: string, currentQty: number, action: 'increase' | 'decrease') => {
    if (action === 'decrease' && currentQty <= 1) return;

    const mutation = action === 'increase' ? increaseQty : decreaseQty;
    mutation(
      { cartItemId: id, quantity: 1 },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [CART_ITEMS] });
        },
        onError: (error: any) => {
          enqueueSnackbar(error.response?.errors?.[0]?.message || 'Failed to update quantity', { variant: 'error' });
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    removeItem(
      { cartItemId: id },
      {
        onSuccess: (res) => {
          enqueueSnackbar(res.deleteCartItem.message, { variant: 'success' });
          queryClient.invalidateQueries({ queryKey: [CART_ITEMS] });
        },
        onError: (error: any) => {
          enqueueSnackbar(error.response?.errors?.[0]?.message || 'Failed to remove item', { variant: 'error' });
        }
      }
    );
  };

  return (
    <div className="px-4 py-2 flex-1">
      <h1 className="text-lg text-[#e4e4e4] font-semibold tracking-wide">
        Order Details
      </h1>
      <div
        className="flex-1 overflow-y-auto py-6 space-y-4 scrollbar-hide"
        ref={scrolLRef}
      >
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : cartItems.length > 0 ? (
          cartItems.map((item: any) => (
            <div key={item.id} className="group relative bg-[#262626] rounded-2xl p-3 border border-white/5 hover:border-[#F6B100]/20 transition-all flex gap-4">
              <div className="w-20 h-20 bg-[#131313] rounded-xl overflow-hidden shrink-0">
                <img src={item?.food?.image || '/assets/food.png'} alt={item?.food?.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-[#f5f5f5] font-bold text-sm leading-tight pr-6">{item?.food?.name}</h3>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[#adaaaa] hover:text-red-500 transition-colors p-1 cursor-pointer"
                    >
                      <MdDeleteOutline size={18} />
                    </button>
                  </div>
                  <p className="text-[#F6B100] font-black text-sm mt-1">₹{item?.food?.price}</p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item?.quantity, 'decrease')}
                      className="p-1 px-2 hover:bg-white/5 text-[#adaaaa] transition-all disabled:opacity-20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item?.quantity <= 1}
                    >
                      <IoRemove size={14} />
                    </button>
                    <span className="px-2 text-[#f5f5f5] text-xs font-bold min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 'increase')}
                      className="p-1 px-2 hover:bg-white/5 text-[#F6B100] transition-all cursor-pointer"
                    >
                      <IoAdd size={14} />
                    </button>
                  </div>
                  <p className="text-[#f5f5f5] font-bold text-sm">₹{item?.quantity * item?.food?.price}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
            <MdOutlineShoppingCart size={80} className="text-[#adaaaa] mb-4" />
            <p className="text-xl font-bold text-white">Your cart is empty</p>
            <p className="text-[#adaaaa] text-sm mt-2 text-center">Add some delicious dishes to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartInfo;
