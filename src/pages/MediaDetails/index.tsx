import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Genre {
  id: number;
  name: string;
}

interface Media {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: Genre[];
  vote_average: number;
  vote_count: number;
  popularity: number;
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const MediaDetails = () => {
  const { id, mediaType } = useParams<{ id: string; mediaType: string }>();
  const [media, setMedia] = useState<Media | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        if (!id || !mediaType) return;
        setError(null);
        const mediaResponse = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`
        );
        if (!mediaResponse.ok) {
          throw new Error("Failed to fetch media details");
        }
        const mediaData: Media = await mediaResponse.json();
        setMedia(mediaData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching media details:", error);
      }
    };
    fetchMediaDetails();
  }, [id, mediaType]);

  if (error) return <div>Error: {error}</div>;
  if (!media) return <div>Loading...</div>;

  const title = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/w1280${media.backdrop_path})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" />

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-xl w-full">
          {/* Main Content Container */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center lg:justify-between w-full text-white space-y-8">
            {/* Media Details Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
              <p className="text-lg text-gray-300">{releaseDate}</p>

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

export default MediaDetails;
