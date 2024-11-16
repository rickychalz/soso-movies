
import UserInfo from "./UserInfo"
import ViewHistory from "./ViewHistory"
import MyWatchlist from "./Watchlist"


const index = () => {
  return (
    <div className="bg-[#121212] h-full ">
    <div className="  py-24 text-white flex flex-col items-start mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-0">
      <UserInfo/>
      <ViewHistory onDetailPageView={undefined}/>
      <MyWatchlist/>
      </div>
      </div>
  )
}

export default index