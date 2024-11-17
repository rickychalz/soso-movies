import MediaCard from "@/components/custom/MediaCard"; // Use MediaCard instead of MovieCard
import useAuthStore from "@/store/auth-context";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface WatchlistItem {
  _id: string;
  user: string;
  mediaId: string; // ID of the media (movie or TV show)
  mediaTitle: string; // Title of the movie or TV show
  posterPath: string;
  mediaType: 'movie' | 'tv'; // Media type (movie or tv)
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
  id: parseInt(item.mediaId), // Make sure mediaId is valid and convertible
  title: item.mediaTitle,
  poster_path: item.posterPath,
  overview: "", // Can be extended to fetch overview
  backdrop_path: "", // Optional: Could fetch the backdrop if necessary
  release_date: "", // Optional: Could fetch release date for movies or TV shows
  genre_ids: [], // Optional: Can extend to get genres if needed
  vote_average: 0,
  vote_count: 0,
  popularity: 0,
  media_type: item.mediaType, // Include the media type (movie or tv)
});

const Watchlist = () => {
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

  const getGenres = () => ""; // Can be extended to fetch genres if needed

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
    <div className="py-10 bg-[#121212] w-full">
      <div className="flex flex-col items-start mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-white mb-8 flex items-center justify-between w-full">
          <span className="text-2xl font-bold text-gray-500">My Watchlist</span>
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
                <Link
                  key={item._id}
                  to={`/media/${item.mediaType}/${item.mediaId}`}
                >
                  <MediaCard
                    id={parseInt(item.mediaId)} // Ensure correct ID format
                    title={item.mediaTitle} // Pass the media title
                    overview={""} // Default to an empty string for now
                    posterPath={item.posterPath} // Pass the poster path
                    mediaType={item.mediaType} // Pass the media type (movie or tv)
                    genreIds={[]} // Default to an empty array since genres are not provided
                    getGenres={getGenres} // Pass the getGenres function
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

export default Watchlist;
