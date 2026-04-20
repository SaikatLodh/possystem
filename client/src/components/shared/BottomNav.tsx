
import { BiSolidDish } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

import { CgProfile } from "react-icons/cg";
import { IoFastFoodSharp } from "react-icons/io5";
import { useAppSelector } from "../../store/hook";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useDispatch();


  const isActive = (path: string) => location.pathname === path;
  const { user } = useAppSelector((state) => state.auth);



  return (
    <>
      <div className=" bg-[#262626] p-2 h-16 flex justify-around">
        {user?.role !== "customer" && (
          <button
            onClick={() => navigate("/")}
            className={`flex items-center justify-center font-bold ${isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
              } w-[300px] rounded-[20px] cursor-pointer`}
          >
            <FaHome className="inline mr-2" size={20} /> <p>Home</p>
          </button>
        )}

        <button
          onClick={() => navigate("/foods")}
          className={`flex items-center justify-center font-bold ${isActive("/foods")
            ? "text-[#f5f5f5] bg-[#343434]"
            : "text-[#ababab]"
            } w-[300px] rounded-[20px] cursor-pointer`}
        >
          <IoFastFoodSharp className="inline mr-2" size={20} /> <p>Foods</p>
        </button>
        <button
          onClick={() => navigate("/tables")}
          className={`flex items-center justify-center font-bold ${isActive("/tables")
            ? "text-[#f5f5f5] bg-[#343434]"
            : "text-[#ababab]"
            } w-[300px] rounded-[20px] cursor-pointer`}
        >
          <MdTableBar className="inline mr-2" size={20} /> <p>Tables</p>
        </button>
        <button
          onClick={() => navigate("/orders")}
          className={`flex items-center justify-center font-bold ${isActive("/orders")
            ? "text-[#f5f5f5] bg-[#343434]"
            : "text-[#ababab]"
            } w-[300px] rounded-[20px] cursor-pointer`}
        >
          <MdOutlineReorder className="inline mr-2" size={20} /> <p>Orders</p>
        </button>

        <button className="flex items-center justify-center font-bold text-[#ababab] w-[300px] cursor-pointer" onClick={() => navigate("/profile")}>
          <CgProfile className="inline mr-2" size={20} /> <p>Profile</p>
        </button>

        {/* <button
          disabled={isActive("/tables") || isActive("/menu")}

          className="absolute bottom-6 bg-[#F6B100] text-[#f5f5f5] rounded-full p-4 items-center cursor-pointer"
        >
          <BiSolidDish size={40} />
        </button> */}


      </div>
    </>
  );
};

export default BottomNav;
