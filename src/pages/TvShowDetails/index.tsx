import { recordMediaView } from "@/utils/ViewTracker";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Genre {
  id: number;
  name: string;
}

interface Network {
  id: number;
  name: string;
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

const TvShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tvShow, setTvShow] = useState<TvShow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tvShow) {
      recordMediaView({
        id: tvShow.id,
        title: tvShow.name,
        type: 'tv'
      });
    }
  }, [tvShow]);


  useEffect(() => {
    const fetchTvShowDetails = async () => {
      try {
        if (!id) return;
        setError(null);

        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch TV show details");
        }

        const tvShowData: TvShow = await response.json();
        setTvShow(tvShowData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching TV show details:", error);
      }
    };

    fetchTvShowDetails();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!tvShow) return <div>Loading...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/w1280${tvShow.backdrop_path})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" />

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-xl w-full">
          {/* Main Content Container */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center lg:justify-between w-full text-white space-y-8">
            {/* TV Show Details Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{tvShow.name}</h1>
              <p className="text-lg text-gray-300">{tvShow.first_air_date}</p>
              
              <div className="mt-6">
                <p className="text-base md:text-lg leading-relaxed">{tvShow.overview}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Genres:</h3>
                <p className="text-gray-300">
                  {tvShow.genres?.map((genre) => genre.name).join(", ")}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Rating:</h3>
                <p className="text-gray-300">
                  {tvShow.vote_average} ({tvShow.vote_count} votes)
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Seasons and Episodes:</h3>
                <p className="text-gray-300">
                  {tvShow.number_of_seasons} Seasons, {tvShow.number_of_episodes} Episodes
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Network:</h3>
                <p className="text-gray-300">
                  {tvShow.networks.map((network) => network.name).join(", ")}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center lg:justify-start mt-8">
              <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-all duration-200 text-center min-w-[160px]">
                Watch Trailer
              </button>
              <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-200 text-center min-w-[160px]">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvShowDetails;
