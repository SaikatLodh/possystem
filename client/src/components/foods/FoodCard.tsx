import React from "react";
import { MdOutlineEdit, MdOutlineDelete, MdAddShoppingCart } from "react-icons/md";
import type { CartItem, User } from "../../interface";
import { useQlMutation } from "../../graphql/globalRequest";
import { createCartItem } from "../../graphql/query/cartItem";
import { enqueueSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { CART_ITEMS } from "../../tanstackKeys";

interface FoodCardProps {
  id: string | number;
  name: string;
  price: number;
  category: string;
  image?: string;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: any, name: string) => void;
  onAdd?: (id: string | number) => void;
  user: User | null;
  cartData: CartItem[];
}

const FoodCard: React.FC<FoodCardProps> = ({
  id,
  name,
  price,
  category,
  image,
  onEdit,
  onDelete,
  onAdd,
  user,
  cartData
}) => {
  const queryClient = useQueryClient();
  const { mutate: addToCartMutation, isPending } = useQlMutation(createCartItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Call the parent callback if provided (e.g. for opening the drawer)
    onAdd?.(id);

    addToCartMutation(
      { foodId: String(id), quantity: 1 },
      {
        onSuccess: (res) => {
          if (res.createCartItem.status === 200 || res.createCartItem.status === 201) {
            enqueueSnackbar(res.createCartItem.message, { variant: "success" });
            queryClient.invalidateQueries({ queryKey: [CART_ITEMS] });
          } else {
            enqueueSnackbar(res.createCartItem.message, { variant: "error" });
          }
        },
        onError: (error: any) => {
          enqueueSnackbar(
            error.response?.errors?.[0]?.message || "Failed to add item to cart",
            { variant: "error" }
          );
        },
      }
    );
  };
  const isCartItemExist = cartData?.some((item) => item?.food?.id === id);


  return (
    <div className="group relative flex flex-col items-start hover:bg-[#2c2c2c] bg-[#262626] rounded-[12px] p-4 transition-all duration-300 hover:bg-[#20201f] hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer">
      {/* Food Image Placeholder / Actual Image */}
      <div className="w-full h-40 bg-[#131313] rounded-[8px] mb-4 overflow-hidden relative">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#333]">
            <span className="text-4xl font-serif">🍲</span>
          </div>
        )}

        {/* Floating Category Tag */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-[4px] border border-white/5">
          <p className="text-[10px] font-bold tracking-widest text-[#adaaaa] uppercase">{category}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="w-full flex flex-col gap-1">
        <h3 className="text-[#f5f5f5] text-lg font-bold leading-tight group-hover:text-[#F6B100] transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[#F6B100] text-xl font-black">
            ₹{price}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
            {user?.role === "admin" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(id);
                }}
                className="p-2 bg-[#2c2c2c] hover:bg-blue-600/20 text-[#adaaaa] hover:text-blue-400 rounded-md transition-all cursor-pointer"
                title="Edit Item"
              >
                <MdOutlineEdit size={16} />
              </button>
            )}
            {user?.role === "admin" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(id, name);
                }}
                className="p-1.5 bg-[#1f1f1f] hover:bg-[#343434] text-red-500 rounded-md cursor-pointer"
                title="Delete Table"
              >
                <MdOutlineDelete size={18} />
              </button>
            )}
            <button
              onClick={handleAddToCart}
              disabled={isPending || isCartItemExist}
              className="p-2 bg-[#F6B100] hover:bg-[#fdc003] text-[#3d2b00] rounded-md transition-all ml-1 shadow-[0_0_15px_rgba(255,209,108,0.2)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add to Cart"

            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-[#1a1a1a]/30 border-t-[#1a1a1a] rounded-full animate-spin" />
              ) : (
                <MdAddShoppingCart size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
