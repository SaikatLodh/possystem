import { BsCashCoin } from "react-icons/bs";
import Greetings from "../components/home/Greetings";
import MiniCard from "../components/home/MiniCard";
import PopularDishes from "../components/home/PopularDishes";
import RecentOrders from "../components/home/RecentOrders";
import { GrInProgress } from "react-icons/gr";
import { useAppSelector } from "../store/hook";
import useQlQuery from "../graphql/globalRequest";
import { DASHBOARD_DATA } from "../tanstackKeys";
import { dashboardData } from "../graphql/query/admin";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data } = useQlQuery(DASHBOARD_DATA, dashboardData)
  return (
    <>
      <section className="bg-[#1f1f1f]  h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
        {/* Left Div */}
        <div className="flex-[3]">
          <Greetings user={user?.fullname || "TEST USER"} />
          <div className="flex items-center w-full gap-3 px-8 mt-8">
            <MiniCard
              title="Total Earnings"
              icon={<BsCashCoin />}
              number={512}
              footerNum={1.6}
            />
            <MiniCard
              title="In Progress"
              icon={<GrInProgress />}
              number={16}
              footerNum={3.6}
            />
          </div>
          <RecentOrders data={data} />
        </div>
        {/* Right Div */}
        <div className="flex-[2]">
          <PopularDishes data={data} />
        </div>
        {/* <BottomNav /> */}
      </section>
    </>
  );
};

export default Home;
