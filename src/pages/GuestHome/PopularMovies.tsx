import MovieCard from "@/components/custom/MovieCard";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

interface MovieResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const PopularMovies = () => {
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setError(null);

        // Fetch popular movies (most popular this week)
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );

        if (!movieResponse.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data: MovieResponse = await movieResponse.json();
        // Limit to first 10 movies
        setLatestMovies(data.results.slice(0, 10));

        // Fetch genres
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );

        if (!genreResponse.ok) {
          throw new Error('Failed to fetch genres');
        }

        const genreData = await genreResponse.json();
        setGenres(genreData.genres);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error("Error fetching the popular movies:", error);
      }
    };

    fetchPopularMovies();
  }, []);

  const getGenres = (genreIds: number[]) => {
    if (!genres || genres.length === 0) return "No genres available";

    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : "Unknown";
      })
      .join(", ");
  };

  return (
    <div className="py-12 bg-[#121212]">
      <div className="flex flex-col items-start mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-0">
        <div className="text-white mb-8 flex items-center justify-between w-full">
          <span className="text-3xl font-bold">Popular this week</span>
          <span>See all</span>
        </div>
        <div className="w-full overflow-hidden">
          <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide" 
               style={{
                 msOverflowStyle: 'none',
                 scrollbarWidth: 'none',
                 WebkitOverflowScrolling: 'touch'
               }}>
            {latestMovies.map((movie) => (
              <Link
              to={`/movies/${movie.id}`}
            >
              <MovieCard key={movie.id} movie={movie} getGenres={getGenres} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularMovies;
