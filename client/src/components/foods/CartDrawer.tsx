import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline, IoAdd, IoRemove } from 'react-icons/io5';
import { MdOutlineShoppingCart, MdDeleteOutline } from 'react-icons/md';
import { useQlMutation } from '../../graphql/globalRequest';
import { increaseCartItemQuantity, decreaseCartItemQuantity, deleteCartItem } from '../../graphql/query/cartItem';
import { CART_ITEMS } from '../../tanstackKeys';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import type { CartItem } from '../../interface';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartData: CartItem[];
  isLoading: boolean;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartData, isLoading }) => {
  const queryClient = useQueryClient();


  const { mutate: increaseQty } = useQlMutation(increaseCartItemQuantity);
  const { mutate: decreaseQty } = useQlMutation(decreaseCartItemQuantity);
  const { mutate: removeItem } = useQlMutation(deleteCartItem);

  const cartItems = cartData || [];
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
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-md bg-[#1a1a1a] shadow-[20px_0_60px_rgba(0,0,0,0.5)] border-r border-white/5 z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#20201f]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F6B100]/10 rounded-xl text-[#F6B100]">
                  <MdOutlineShoppingCart size={24} />
                </div>
                <div>
                  <h2 className="text-xl text-[#f5f5f5] font-bold tracking-tight">Your Order</h2>
                  <p className="text-[#adaaaa] text-xs transition-all">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-[#2c2c2c] hover:bg-red-600/20 text-[#adaaaa] hover:text-red-400 rounded-full transition-all cursor-pointer"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
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

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-[#20201f] space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[#adaaaa] text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between text-[#f5f5f5] text-lg font-bold pt-1 border-t border-white/5">
                  <span>Total Amount</span>
                  <span className="text-[#F6B100]">₹{subtotal}</span>
                </div>
              </div>

              <button
                disabled={cartItems.length === 0}
                className="w-full py-4 bg-[#F6B100] hover:bg-[#fdc003] text-[#1a1a1a] font-bold rounded-2xl shadow-lg shadow-[#F6B100]/10 transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Link to="/tables">Select Your Table</Link>
              </button>

              <button
                onClick={onClose}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-[#adaaaa] font-bold rounded-2xl transition-all cursor-pointer border border-white/5"
              >
                Continue Selection
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
