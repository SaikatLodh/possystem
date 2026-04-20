import { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { menus } from '../utils/Data'
import FoodCard from '../components/foods/FoodCard'
import BackButton from '../components/shared/BackButton'
import CreateFoodModal from '../components/foods/CreateFoodModal'
import useQlQuery from '../graphql/globalRequest'
import { CART_ITEMS, FOODS } from '../tanstackKeys'
import { getAllFoods } from '../graphql/query/food'
import { useSearchParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DeleteFoodModal from '../components/foods/DeleteFoodModal'
import { useDebouncedCallback } from 'use-debounce';
import FoodCardSkeleton from '../components/foods/FoodCardSkeleton';
import { useAppSelector } from '../store/hook'
import CartDrawer from '../components/foods/CartDrawer';
import { getCartItems } from '../graphql/query/cartItem'

const Foods = () => {
  const [selectedCategory, setSelectedCategory] = useState(menus[0]);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFoodId, setEditFoodId] = useState<string | null>(null);
  const [foodToDelete, setFoodToDelete] = useState<{ id: string, name: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const foodSchema = z.object({
    name: z.string().min(6, "Name must be at least 6 characters").max(60, "Name must be at most 60 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(200, "Description must be at most 200 characters"),
    price: z.number({ message: "Price is required and must be a valid number" }).positive("Price must be positive"),
    category: z.string().min(3, "Category must be at least 3 characters").max(50, "Category must be at most 50 characters"),
    file: z.any()
      .refine((fileList) => {
        if (editFoodId) return true;
        return fileList && fileList.length === 1;
      }, "An image file is required.")
  });

  type FoodFormValues = z.infer<typeof foodSchema>;


  const [value, setValue] = useState(search);
  const debounced = useDebouncedCallback(
    (value) => {
      setValue(value);
      setSearchParams({ search: value, page: "1" });
    },
    500
  );


  const openCreateModal = () => {
    setEditFoodId(null);
    reset({ name: "", description: "", price: 0, category: "", file: undefined });
    setIsModalOpen(true);
  };

  const handleEdit = (id: string | number) => {
    const food = foods?.getFoods?.foods.find((f: any) => f.id === id);
    if (food) {
      reset({
        name: food.name,
        description: food.description,
        price: food.price,
        category: food.category,
        file: undefined
      });
      setEditFoodId(String(id));
      setIsModalOpen(true);
    }
  };

  const setCategory = (category: any) => {
    setSelectedCategory(category);
    setSearchParams({ category: category.name.toLowerCase() });
  };

  const openDeleteModal = (id: string, name: string) => {
    setFoodToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleAddToCart = (id: string | number) => {
    setIsCartOpen(true);
  };

  const { data: foods, isLoading } = useQlQuery(FOODS, getAllFoods, { search, page, limit: 10, category: selectedCategory.name === "All" ? "" : category });
  const totalPages = foods?.getFoods?.pagination?.totalPages || 1;
  const { data: cartData, isLoading: isCartLoading } = useQlQuery(CART_ITEMS, getCartItems);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema),
  });





  return (
    <div className='bg-[#1f1f1f] h-[calc(100vh-5rem)] flex flex-col'>
      {/* Header Section with Editorial Precision */}
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4 ">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
            Foods
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          {user?.role === "admin" && (
            <button
              onClick={openCreateModal}
              className={`text-white text-lg bg-[#F6B100] rounded-lg px-5 py-2 font-semibold cursor-pointer`}
            >
              Create Foods
            </button>
          )}

          <div className='relative w-full lg:w-[400px] group'>
            <IoSearchOutline className='absolute left-4 top-1/2 -translate-y-1/2 text-[#adaaaa] group-focus-within:text-[#ffd16c] transition-colors' size={22} />
            <input
              type="text"
              placeholder="Find a dish..."
              onChange={(e) => debounced(e.target.value)}
              className='w-full bg-[#1a1a1a] text-[#f5f5f5] pl-12 pr-4 py-4 rounded-2xl border border-white/5 focus:border-[#ffd16c]/20 outline-none transition-all placeholder:text-[#333] shadow-inner'
            />
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-4 bg-[#1a1a1a] hover:bg-[#2c2c2c] text-[#F6B100] rounded-2xl border border-white/5 hover:border-[#F6B100]/20 transition-all cursor-pointer relative group"
            title="Open Cart"
          >
            <MdOutlineShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F6B100] text-[#1a1a1a] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#1a1a1a] group-hover:scale-110 transition-transform">
              {cartData ? cartData.getCartItemsByUserId.cartItems?.length : 0}
            </span>
          </button>
        </div>
      </div>
      {/* Tonal Category Navigation */}
      <div className='px-10 py-2 flex gap-4 overflow-x-auto pb-8 scrollbar-hide'>
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setCategory(menu)}
            className={`flex items-center cursor-pointer gap-3 px-8 py-4 rounded-2xl transition-all duration-500 whitespace-nowrap transform active:scale-95 ${selectedCategory.id === menu.id
              ? 'bg-[#F6B100] text-white font-black shadow-[0_10px_30px_rgba(255,209,108,0.15)] translate-y-[-2px]'
              : 'bg-[#1a1a1a] text-[#adaaaa] hover:bg-[#20201f] border border-white/5 hover:translate-y-[-1px]'
              }`}
          >
            <span className='text-xl'>{menu.icon}</span>
            <span className='text-md uppercase tracking-widest font-bold'>{menu.name}</span>
          </button>
        ))}
      </div>

      {/* Grid of Food Cards with Layered Depth */}
      <div className='flex-1 overflow-y-auto px-10 pb-20 scrollbar-hide bg-gradient-to-b from-transparent to-black/20 mt-5'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8'>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))
          ) : foods && foods?.getFoods?.foods.length > 0 ? (
            foods?.getFoods?.foods.map((item) => (
              <FoodCard
                key={item?.id}
                id={item?.id || ""}
                name={item?.name || ""}
                price={item?.price || 0}
                category={item?.category || ""}
                image={item?.image || "/assets/food.png"} // Demonstration asset from generation
                onAdd={(id) => handleAddToCart(id)}
                onEdit={(id) => handleEdit(id)}
                onDelete={openDeleteModal}
                user={user}
                cartData={cartData?.getCartItemsByUserId?.cartItems || []}

              />
            ))
          ) : (
            <div className='col-span-full flex flex-col items-center justify-center py-40 opacity-20'>
              <IoSearchOutline size={80} className='text-[#adaaaa] mb-4' />
              <p className='text-2xl font-bold text-white'>No items match your hunt</p>
            </div>
          )}
        </div>
        {foods && foods?.getFoods?.pagination.totalPages > 1 && !isLoading && (
          <div
            className="flex items-center justify-center gap-4 sm:gap-6 mt-16 animate-fade-in-up"
            style={{ animationDelay: "300ms" }}
          >
            <button
              disabled={page <= 1}
              onClick={() =>
                setSearchParams({ search, page: String(page - 1) })
              }
              className="px-5 sm:px-6 py-3 bg-[#1a1a1a] backdrop-blur-md text-[#adaaaa] font-semibold rounded-2xl shadow-sm hover:shadow-md border border-white/5 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#20201f] hover:text-[#F6B100] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#F6B100]/50 flex items-center gap-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:block">Previous</span>
            </button>
            <div className="flex items-center space-x-2">
              {(() => {
                let pages: (number | string)[] = [];
                if (totalPages <= 6) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  if (page <= 4) {
                    pages = [1, 2, 3, 4, 5, "...", totalPages];
                  } else if (page >= totalPages - 3) {
                    pages = [
                      1,
                      "...",
                      totalPages - 4,
                      totalPages - 3,
                      totalPages - 2,
                      totalPages - 1,
                      totalPages,
                    ];
                  } else {
                    pages = [
                      1,
                      "...",
                      page - 1,
                      page,
                      page + 1,
                      "...",
                      totalPages,
                    ];
                  }
                }

                return pages.map((p, i) => {
                  if (p === "...") {
                    return (
                      <span
                        key={i}
                        className="px-2 text-slate-400 font-bold tracking-widest pointer-events-none"
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={i}
                      onClick={() =>
                        setSearchParams({ search, page: String(p) })
                      }
                      className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold transition-all duration-300 cursor-pointer ${page === p
                        ? "bg-[#F6B100] text-white shadow-[0_5px_15px_rgba(246,177,0,0.2)] scale-110"
                        : "bg-[#1a1a1a] text-[#adaaaa] hover:bg-[#20201f] hover:text-[#F6B100] border border-white/5"
                        }`}
                    >
                      {p}
                    </button>
                  );
                });
              })()}
            </div>
            <button
              disabled={page >= totalPages}
              onClick={() =>
                setSearchParams({ search, page: String(page + 1) })
              }
              className="px-5 sm:px-6 py-3 bg-[#1a1a1a] backdrop-blur-md text-[#adaaaa] font-semibold rounded-2xl shadow-sm hover:shadow-md border border-white/5 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-[#20201f] hover:text-[#F6B100] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#F6B100]/50 flex items-center gap-2 cursor-pointer"
            >
              <span className="hidden sm:block">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>


      {/* Render the Create Food Modal */}

      <CreateFoodModal categories={menus} register={register}
        handleSubmit={handleSubmit}
        reset={reset}
        errors={errors}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editFoodId={editFoodId}
        setEditFoodId={setEditFoodId} />

      <DeleteFoodModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        foodToDelete={foodToDelete}
        setFoodToDelete={setFoodToDelete}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartData={cartData?.getCartItemsByUserId?.cartItems || []}
        isLoading={isCartLoading}
      />

    </div>
  )
}

export default Foods
