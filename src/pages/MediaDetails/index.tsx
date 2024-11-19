import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth-context";

interface Genre {
  id: number;
  name: string;
}

interface Network {
  id: number;
  name: string;
}

interface BaseMedia {
  id: number;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres?: Genre[];
  vote_average: number;
  vote_count: number;
  popularity: number;
}

interface Movie extends BaseMedia {
  title: string;
  release_date: string;
  genre_ids: number[];
}

interface TvShow extends BaseMedia {
  name: string;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  networks: Network[];
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";
const API_BASE_URL = "http://localhost:8000";

const Details = () => {
  const { id, mediaType } = useParams<{ id: string; mediaType: "movie" | "tv" }>();
  const [media, setMedia] = useState<Movie | TvShow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const hasRecordedView = useRef(false);  // Track if view has been recorded

  const recordMediaView = async ({ id, title, type }: { id: number; title: string; type: string }) => {
    if (!user?.token) return;
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/update-views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ 
          id, 
          title, 
          // Convert media type to match backend expectations
          type: mediaType === "movie" ? "movie" : "tv"
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to track media view");
      }
  
      const data = await response.json();
      console.log("View tracked:", data);
    } catch (error) {
      console.error("Error tracking view:", error);
     
    }
  };
  
 
  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
  
        if (!id || !mediaType) {
          throw new Error("Missing required parameters");
        }
  
        const endpoint = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`;
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${mediaType} details`);
        }
  
        const data = await response.json();
        setMedia(data);
  
        // Record view only once
        if (!hasRecordedView.current) {
          hasRecordedView.current = true;
          recordMediaView({
            id: data.id,
            title: mediaType === "movie" ? data.title : data.name,
            type: mediaType,
          });
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching media details:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMediaDetails();
  }, [id, mediaType]);  

  const handleAddToWatchlist = async () => {
    if (!media || !user?.token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/add-to-watchlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          mediaId: media.id,
          mediaTitle: mediaType === "movie" ? (media as Movie).title : (media as TvShow).name,
          posterPath: media.poster_path,
          mediaType,
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!media) return null;

  const title = mediaType === "movie" ? (media as Movie).title : (media as TvShow).name;
  const releaseDate = mediaType === "movie" 
    ? (media as Movie).release_date 
    : (media as TvShow).first_air_date;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: media.backdrop_path 
          ? `url(https://image.tmdb.org/t/p/w1280${media.backdrop_path})`
          : "none",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-xl w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between w-full text-white space-y-8 lg:space-y-0 lg:space-x-8">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
              <p className="text-lg text-gray-300">{releaseDate}</p>

              <div className="mt-6">
                <p className="text-base md:text-lg leading-relaxed">{media.overview}</p>
              </div>

              {media.genres && media.genres.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-2">Genres:</h3>
                  <p className="text-gray-300">
                    {media.genres.map((genre) => genre.name).join(", ")}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Rating:</h3>
                <p className="text-gray-300">
                  {media.vote_average.toFixed(1)} ({media.vote_count.toLocaleString()} votes)
                </p>
              </div>

              {mediaType === "tv" && (
                <>
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-2">Seasons and Episodes:</h3>
                    <p className="text-gray-300">
                      {(media as TvShow).number_of_seasons} Seasons, 
                      {(media as TvShow).number_of_episodes} Episodes
                    </p>
                  </div>

                  {(media as TvShow).networks && (media as TvShow).networks.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-bold mb-2">Network:</h3>
                      <p className="text-gray-300">
                        {(media as TvShow).networks.map((network) => network.name).join(", ")}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center lg:justify-start mt-8">
              <button 
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-all duration-200 text-center min-w-[160px]"
                onClick={() => {
                  
                  console.log("Watch trailer clicked");
                }}
              >
                Watch Trailer
              </button>

              <button
                onClick={handleAddToWatchlist}
                className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-200 text-center min-w-[160px]"
              >
                {user?.token ? "Add to Watchlist" : "Login to Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
