import MovieTVCategories from "./Categories";
import CTA from "./CTA";
import Hero from "./Hero";
import LatestMovies from "./LatestMovies";
import PopularMovies from "./PopularMovies";
import Section from "./Section";
import Section2 from "./Section2";
import Stats from "./Stats";
import TrendingShows from "./TrendingShows";


const index = () => {
 

  return (
    <div >
      <Hero/>
      <LatestMovies/>
      <PopularMovies/>
      <Stats/>
      <TrendingShows/>
      <Section/>
      <MovieTVCategories/>
      <Section2/>
      <CTA/>
    </div>
  );
};

export default index;
