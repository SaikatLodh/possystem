import { FaLongArrowAltRight } from "react-icons/fa";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { getBgColor } from "../../utils/features";
import type { User } from "../../interface";
import { Link } from "react-router-dom";

const TableCard = ({
  id,
  name,
  status,
  initials,
  seats,
  onEdit,
  onDelete,
  user
}: {
  id: string;
  name: number;
  status: string;
  initials: number;
  seats: number;
  onEdit?: (id: string, name: number, seats: number) => void;
  onDelete?: (id: string, name: number) => void;
  user: User | null;
}) => {

  return (
    <>
      <Link to={`/menu?table=${name}`}>
        <div

          key={id}
          className="w-[300px] hover:bg-[#2c2c2c] bg-[#262626] p-4 rounded-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between px-1">
            <h1 className="text-[#f5f5f5] text-xl font-semibold">
              Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
              {name}
            </h1>
            <p
              className={`${status === "Booked" ? "text-green-600 bg-[#2e4a40]" : "bg-[#664a04] text-white"} px-2 py-1 rounded-lg`}
            >
              {status}
            </p>
          </div>
          <div className="flex items-center justify-center mt-5 mb-8">
            <h1
              className={`text-white w-20 h-20 rounded-full p-5 text-xl flex items-center justify-center`}
              style={{ backgroundColor: initials ? getBgColor() : "#1f1f1f" }}
            >
              {initials || "N/A"}
            </h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[#ababab] text-xs">
              Seats: <span className="text-[#f5f5f5]">{seats}</span>
            </p>
            {user?.role === "admin" && (
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(id, name, seats);
                  }}
                  className="p-1.5 bg-[#1f1f1f] hover:bg-[#343434] text-blue-500 rounded-md cursor-pointer"
                  title="Edit Table"
                >
                  <MdOutlineEdit size={18} />
                </button>
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
              </div>
            )}
          </div>
        </div>
      </Link>
    </>

  );
};

export default TableCard;
