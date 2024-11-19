import MediaCard from "@/components/custom/MediaCard"; // Use MediaCard instead of MovieCard
import useAuthStore from "@/store/auth-context";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface WatchlistItem {
  _id: string;
  user: string;
  movieId: string;
  movieTitle: string;
  posterPath: string;
  createdAt: string;
  updatedAt: string;
}

interface WatchlistResponse {
  success: boolean;
  data: WatchlistItem[];
  pagination: {
    current: number;
    total: number;
    totalItems: number;
  };
}

const formatWatchlistItem = (item: WatchlistItem) => ({
  id: parseInt(item.movieId),
  title: item.movieTitle,
  poster_path: item.posterPath,
  overview: "",
  backdrop_path: "",
  release_date: "",
  genre_ids: [],
  vote_average: 0,
  vote_count: 0,
  popularity: 0,
});

const MyWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setError(null);
        const response = await fetch(
          `http://localhost:8000/api/users/get-watchlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch watchlist");
        }

        const data: WatchlistResponse = await response.json();
        setWatchlist(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchWatchlist();
  }, [user?.token]);

  // Function to retrieve genre names (currently not used, so an empty string is returned)
  const getGenres = () => "";

  if (error) {
    return (
      <div className="py-12 bg-[#121212] w-full">
        <div className="text-white px-4 sm:px-6 lg:px-8">
          Error loading watchlist: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#121212] w-full">
      <div className="flex flex-col items-start mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-white mb-8 flex items-center justify-between w-full">
          <span className="text-2xl font-bold text-gray-500">My Watchlist</span>
          <Link to="/watchlist"><span className="text-sm text-gray-400">See all</span></Link>
        </div>

        <div className="w-full overflow-hidden">
          {watchlist.length === 0 ? (
            <div className="text-white text-center py-8">
              Your watchlist is empty
            </div>
          ) : (
            <div
              className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide"
              style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {watchlist.map((item) => (
                <Link key={item._id} to={`/media/movie/${item.movieId}`}>
                  <MediaCard
                    id={parseInt(item.movieId)} 
                    title={item.movieTitle} 
                    overview="" 
                    posterPath={item.posterPath} 
                    mediaType="movie" 
                    genreIds={[]} 
                    getGenres={getGenres} 
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWatchlist;
