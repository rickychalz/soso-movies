import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MediaCard from "@/components/custom/MediaCard";
import useAuthStore from "@/store/auth-context";

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

const RecommendedMovies = () => {
  const { user } = useAuthStore();
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [favoriteGenres, setFavoriteGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to get genres names from genreIds
  const getGenres = (genreIds: number[]) => {
    // Fetch all genres from TMDB genres
    const allGenres = [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Science Fiction" },
      { id: 10770, name: "TV Movie" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" },
    ];

    return genreIds
      .map((id) => {
        const genre = allGenres.find((g) => g.id === id);
        return genre ? genre.name : "Unknown";
      })
      .join(", ");
  };

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

  // Fetch recommended movies based on favorite genres
  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      if (!favoriteGenres || favoriteGenres.length === 0) {
        return;
      }

      try {
        // Fetch all movie genres
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const genreData = await genreResponse.json();

       
        const userGenreIds = genreData.genres
          .filter((genre: Genre) =>
            favoriteGenres.some((favGenre) => favGenre.name === genre.name)
          )
          .map((genre: Genre) => genre.id);

        // If no matching genre IDs found, return
        if (userGenreIds.length === 0) {
          return;
        }

        // Fetch recommended movies
        const recommendedResponse = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&with_genres=${userGenreIds.join(
            ","
          )}`
        );

        const data: MovieResponse = await recommendedResponse.json();
        setRecommendedMovies(data.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching recommended movies:", error);
        setError("Could not fetch recommended movies");
      }
    };

    fetchRecommendedMovies();
  }, [favoriteGenres]);

  // Don't render if no recommended TV shows
  if (recommendedMovies.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-[#121212]">
      <div className="flex flex-col items-start mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-white mb-8 flex items-center justify-between w-full">
          <span className="text-2xl font-bold text-gray-500">
            Recommended Movies
          </span>
          <Link to="/recommended-movies" className="text-teal-500">
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
            {recommendedMovies.map((movie) => (
              <MediaCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                overview={movie.overview}
                posterPath={movie.poster_path}
                genreIds={movie.genre_ids}
                mediaType="movie"
                getGenres={getGenres}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedMovies;
