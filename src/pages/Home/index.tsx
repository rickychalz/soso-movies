
import LatestMovies from "./LatestMovies"
import PopularMovies from "./PopularMovies"
import TrendingShows from "./TrendingShows"





const index = () => {
  return (
    <div className="flex flex-col mx-auto">
        <LatestMovies/>
        <TrendingShows/>
        <PopularMovies/>
    </div>
  )
}

export default index