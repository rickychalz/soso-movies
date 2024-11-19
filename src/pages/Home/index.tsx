import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LatestMovies from "./LatestMovies";
import PopularMovies from "./PopularMovies";
import TrendingShows from "./TrendingShows";
import GenreModal from "@/components/custom/GenreModal";
import useAuthStore from "@/store/auth-context";
import RecommendedMovies from "./RecommendedMovies";
import RecommendedTVShows from "./RecommendedTvShows";

const Index: React.FC = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user just registered (passed from registration page)
    const justRegistered = location.state?.justRegistered;
    console.log(location.state?.justRegistered); // Should log `true` if the user just registered
    console.log(user)
    if (justRegistered) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [location, user]);

  const handleSaveGenres = (selectedGenres: string[]) => {
    setShowModal(false);
    // Clear the registration state
    window.history.replaceState({}, document.title);
  };

  return (
    <div className="flex flex-col mx-auto">
      {showModal && <GenreModal onSave={handleSaveGenres} />}
      <LatestMovies />
      <RecommendedMovies/>
      <RecommendedTVShows/>
      <TrendingShows />
      <PopularMovies />
    </div>
  );
};

export default Index;