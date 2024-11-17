import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth-context"; // Import auth context
import { recordMediaView } from "@/utils/ViewTracker";

interface Genre {
  id: number;
  name: string;
}

interface Network {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  genre_ids: number[];
  genres?: Genre[];
  vote_average: number;
  vote_count: number;
  popularity: number;
}

interface TvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  genres?: Genre[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  number_of_seasons: number;
  number_of_episodes: number;
  networks: Network[];
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const Details = () => {
  const { id, mediaType } = useParams<{ id: string; mediaType: string }>();
  const [media, setMedia] = useState<Movie | TvShow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore(); // Get user from auth store
  const navigate = useNavigate();

  // Record view for either movie or tv show
  useEffect(() => {
    if (media) {
      recordMediaView({
        id: media.id,
        title: mediaType === "movie" ? media.title : media.name,
        type: mediaType, // Either "movie" or "tv"
      });
    }
  }, [media, mediaType]);

  // Fetch the media details based on the mediaType
  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setError(null);

        if (!id) return;

        const endpoint = mediaType === "movie" 
          ? `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
          : `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${mediaType} details`);
        }

        const data = await response.json();
        setMedia(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching media details:", error);
      }
    };

    fetchMediaDetails();
  }, [id, mediaType]);

  // Handle adding to watchlist
  const handleAddToWatchlist = async () => {
    if (!media) return;
  
    // If the user is not logged in, redirect to login page
    if (!user?.token) {
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/users/add-to-watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          mediaId: media.id,
          mediaTitle: mediaType === "movie" ? media.title : media.name,
          posterPath: media.poster_path,
          mediaType: mediaType,  // Ensure you send the correct media type
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add to watchlist");
      }
  
      alert("Added to Watchlist!");
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!media) return <div>Loading...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/w1280${media.backdrop_path})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-xl w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-center lg:justify-between w-full text-white space-y-8">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{mediaType === "movie" ? media.title : media.name}</h1>
              <p className="text-lg text-gray-300">
                {mediaType === "movie" ? media.release_date : media.first_air_date}
              </p>

              <div className="mt-6">
                <p className="text-base md:text-lg leading-relaxed">{media.overview}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Genres:</h3>
                <p className="text-gray-300">
                  {media.genres?.map((genre) => genre.name).join(", ")}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Rating:</h3>
                <p className="text-gray-300">
                  {media.vote_average} ({media.vote_count} votes)
                </p>
              </div>

              {mediaType === "tv" && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2">Seasons and Episodes:</h3>
                  <p className="text-gray-300">
                    {media.number_of_seasons} Seasons, {media.number_of_episodes} Episodes
                  </p>
                </div>
              )}

              {mediaType === "tv" && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2">Network:</h3>
                  <p className="text-gray-300">
                    {media.networks.map((network) => network.name).join(", ")}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center lg:justify-start mt-8">
              <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-all duration-200 text-center min-w-[160px]">
                Watch Trailer
              </button>

              {user?.token ? (
                <button
                  onClick={handleAddToWatchlist}
                  className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-200 text-center min-w-[160px]"
                >
                  Add to Watchlist
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-200 text-center min-w-[160px]"
                >
                  Add to Watchlist
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
