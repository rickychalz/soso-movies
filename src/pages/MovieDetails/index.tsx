import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Genre {
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

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        if (!id) return;
        setError(null);
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        if (!movieResponse.ok) {
          throw new Error("Failed to fetch movie details");
        }
        const movieData: Movie = await movieResponse.json();
        setMovie(movieData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [id]);

  // Function to handle adding to watchlist
  const handleAddToWatchlist = async () => {
    if (!movie) return;

    try {
      // If you're using a backend API
      const response = await fetch("http://localhost:8000/api/media/add-to-watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to watchlist");
      }

      alert("Added to Watchlist!");
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>Loading...</div>;

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50" />

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-screen-xl w-full">
          {/* Main Content Container */}
          <div className="flex flex-col lg:flex-row items-center lg:items-center lg:justify-between w-full text-white space-y-8">
            {/* Movie Details Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              <p className="text-lg text-gray-300">{movie.release_date}</p>
              
              <div className="mt-6">
                <p className="text-base md:text-lg leading-relaxed">{movie.overview}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Genres:</h3>
                <p className="text-gray-300">
                  {movie.genres?.map((genre) => genre.name).join(", ")}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Rating:</h3>
                <p className="text-gray-300">
                  {movie.vote_average} ({movie.vote_count} votes)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto sm:justify-center lg:justify-start mt-8">
              <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-all duration-200 text-center min-w-[160px]">
                Watch Trailer
              </button>
              <button
                onClick={handleAddToWatchlist}
                className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-all duration-200 text-center min-w-[160px]"
              >
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

