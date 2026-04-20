import { useEffect } from "react";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import MenuContainer from "../components/menu/MenuContainer";
import { useAppSelector } from "../store/hook";
import { useSearchParams } from "react-router-dom";
import useQlQuery from "../graphql/globalRequest";
import { CART_ITEMS, CATEGORIES_COUNT } from "../tanstackKeys";
import { getCartItems } from "../graphql/query/cartItem";
import { getCategoriesCount } from "../graphql/query/food";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const table = searchParams.get("table");
  useEffect(() => {
    document.title = "POS | Menu";
  }, []);
  const { user } = useAppSelector((state) => state.auth);
  const { data: cartData, isLoading: isCartLoading } = useQlQuery(CART_ITEMS, getCartItems);
  const { data: categoriesCountData } = useQlQuery(CATEGORIES_COUNT, getCategoriesCount);

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3 w-full">
      {/* Left Div */}
      <div className="flex-[3] w-[75%]">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wider">
              Menu
            </h1>
          </div>
          <div className="flex items-center justify-around gap-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <MdRestaurantMenu className="text-[#f5f5f5] text-4xl" />
              <div className="flex flex-col items-start">
                <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
                  {user?.fullname || "Customer Name"}
                </h1>
                <p className="text-xs text-[#ababab] font-medium">
                  Table : {table || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <MenuContainer cartItems={cartData?.getCartItemsByUserId?.cartItems || []} categoriesCountData={categoriesCountData?.getCategoriesCount?.categories || []} />
      </div>
      {/* Right Div */}
      <div className="flex flex-col bg-[#1a1a1a] my-4 mr-3 rounded-lg pt-2 w-[25%]">
        {/* Customer Info */}
        <CustomerInfo user={user} table={table} />
        <hr className="border-[#2a2a2a] border-t-2" />
        {/* Cart Items */}
        <CartInfo cartItems={cartData?.getCartItemsByUserId?.cartItems || []} isLoading={isCartLoading} />
        <hr className="border-[#2a2a2a] border-t-2" />
        {/* Bills */}
        <Bill cartItems={cartData?.getCartItemsByUserId?.cartItems || []} />
      </div>


    </section>
  );
};

export default Menu;
