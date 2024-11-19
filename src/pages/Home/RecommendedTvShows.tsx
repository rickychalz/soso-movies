import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MediaCard from "@/components/custom/MediaCard";
import useAuthStore from "@/store/auth-context";

interface Genre {
  id: number;
  name: string;
}

interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
}

interface TVShowResponse {
  page: number;
  results: TVShow[];
  total_results: number;
  total_pages: number;
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const RecommendedTVShows = () => {
  const { user } = useAuthStore();
  const [recommendedTVShows, setRecommendedTVShows] = useState<TVShow[]>([]);
  const [favoriteGenres, setFavoriteGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's favorite genres from backend
  useEffect(() => {
    const fetchFavoriteGenres = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/users/get-favorite-genres",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch favorite genres");
        }

        const data = await response.json();
        setFavoriteGenres(data.favoriteGenres);
      } catch (error) {
        console.error("Error fetching favorite genres:", error);
        setError("Could not fetch favorite genres");
      }
    };

    if (user && user?.token) {
      fetchFavoriteGenres();
    }
  }, [user, user?.token]);

  // Fetch recommended TV shows based on favorite genres
  useEffect(() => {
    const fetchRecommendedTVShows = async () => {
      if (!favoriteGenres || favoriteGenres.length === 0) {
        return;
      }

      try {
        // Fetch TV show genres
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
        );
        const genreData = await genreResponse.json();

        // Map favorite genres to TMDB genre IDs
        const userGenreIds = genreData.genres
          .filter((genre: Genre) =>
            favoriteGenres.some((favGenre) => favGenre.name === genre.name)
          )
          .map((genre: Genre) => genre.id);

        // If no matching genre IDs found, return
        if (userGenreIds.length === 0) {
          return;
        }

        // Fetch recommended TV shows
        const recommendedResponse = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&with_genres=${userGenreIds.join(
            ","
          )}`
        );

        const data: TVShowResponse = await recommendedResponse.json();
        setRecommendedTVShows(data.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching recommended TV shows:", error);
        setError("Could not fetch recommended TV shows");
      }
    };

    fetchRecommendedTVShows();
  }, [favoriteGenres]);

  // Function to get genres names from genreIds
  const getGenres = (genreIds: number[]) => {
    // Fetch all genres from TMDB genres
    const allGenres = [
      { id: 10759, name: "Action & Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 10762, name: "Kids" },
      { id: 9648, name: "Mystery" },
      { id: 10763, name: "News" },
      { id: 10764, name: "Reality" },
      { id: 10765, name: "Sci-Fi & Fantasy" },
      { id: 10766, name: "Soap" },
      { id: 10767, name: "Talk" },
      { id: 10768, name: "War & Politics" },
      { id: 37, name: "Western" },
    ];

    return genreIds
      .map((id) => {
        const genre = allGenres.find((g) => g.id === id);
        return genre ? genre.name : "Unknown";
      })
      .join(", ");
  };

  // Don't render if no recommended TV shows
  if (recommendedTVShows.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-[#121212]">
      <div className="flex flex-col items-start mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-white mb-8 flex items-center justify-between w-full">
          <span className="text-2xl font-bold text-gray-500">
            Recommended TV Shows
          </span>
          <Link to="/recommended-tv-shows" className="text-teal-500">
            See all
          </Link>
        </div>
        <div className="w-full overflow-hidden">
          <div
            className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {recommendedTVShows.map((show) => (
              <MediaCard
                key={show.id}
                id={show.id}
                title={show.name}
                overview={show.overview}
                posterPath={show.poster_path}
                genreIds={show.genre_ids}
                mediaType="tv"
                getGenres={getGenres}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedTVShows;
