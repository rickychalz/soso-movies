import UserInfo from "./UserInfo";
import ViewHistory from "./ViewHistory";
import MyWatchlist from "./Watchlist";

const index = () => {
  return (
    <div className="mx-auto flex flex-col w-full ">
      <UserInfo />
      <ViewHistory />
      <MyWatchlist />
    </div>
  );
};

export default index;
