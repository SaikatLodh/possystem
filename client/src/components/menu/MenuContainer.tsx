import { useState } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { menus } from "../../utils/Data";
import useQlQuery from "../../graphql/globalRequest";
import { FOODS } from "../../tanstackKeys";
import { getAllFoods } from "../../graphql/query/food";
import { useSearchParams } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import FoodCardSkeleton from "../foods/FoodCardSkeleton";
import FoodCard from "../foods/FoodCard";
import { useAppSelector } from "../../store/hook";
import CreateFoodModal from "../foods/CreateFoodModal";
import DeleteFoodModal from "../foods/DeleteFoodModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import type { CartItem } from "../../interface";



const MenuContainer = ({ cartItems, categoriesCountData }: { cartItems: CartItem[], categoriesCountData: { category: string, count: number }[] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "";
  const [selected, setSelected] = useState(menus[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFoodId, setEditFoodId] = useState<string | null>(null);
  const [foodToDelete, setFoodToDelete] = useState<{ id: string, name: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState(0);
  const { data: foods, isLoading } = useQlQuery(FOODS, getAllFoods, { search, page, limit: 10, category: selected.name === "All" ? "" : category });
  const totalPages = foods?.getFoods?.pagination?.totalPages || 1;



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

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema),
  });
  const { user } = useAppSelector((state) => state.auth);

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


  const openDeleteModal = (id: string, name: string) => {
    setFoodToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleAddToCart = (id: string | number) => {
    setIsCartOpen(true);
  };
  return (
    <>
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {menus.map((menu) => {
          return (
            <div
              key={menu.id}
              className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer"
              style={{ backgroundColor: menu.bgColor }}
              onClick={() => {
                setSelected(menu);
                setItemId(0);
                setItemCount(0);
                setSearchParams({ category: menu.name.toLowerCase(), page: "1" });
              }}
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                  {menu.icon} {menu.name}
                </h1>
                {selected.id === menu.id && (
                  <GrRadialSelected className="text-white" size={20} />
                )}
              </div>
              <p className="text-white text-sm font-semibold">
                {menu.name === "All" ? categoriesCountData.reduce((acc, c) => acc + c.count, 0) : categoriesCountData.find((c) => c.category === menu.name.toLowerCase())?.count || 0} Items
              </p>
            </div>
          );
        })}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

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
                cartData={cartItems}

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
    </>
  );
};

export default MenuContainer;
