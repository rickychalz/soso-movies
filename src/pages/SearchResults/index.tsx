import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MediaCard from "@/components/custom/MediaCard";
import useAuthStore from "@/store/auth-context";

interface Media {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv";
  vote_average: number;
  genre_ids: number[];
  release_date?: string;
  first_air_date?: string;
}

interface Genre {
  id: number;
  name: string;
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const SearchResults = () => {
  const [mediaResults, setMediaResults] = useState<Media[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const { isLoggedIn } = useAuthStore();

  const query = new URLSearchParams(location.search).get("query");

  // Fetch genres when component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenresResponse, tvGenresResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
          ),
          fetch(
            `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
          )
        ]);

        const [movieGenresData, tvGenresData] = await Promise.all([
          movieGenresResponse.json(),
          tvGenresResponse.json()
        ]);

      
        const combinedGenres = [
          ...movieGenresData.genres,
          ...tvGenresData.genres
        ];
        
        
        const uniqueGenres = Array.from(
          new Map(combinedGenres.map(genre => [genre.id, genre])).values()
        );

        setGenres(uniqueGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  // Fetch search results for movies and TV shows
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query?.trim()) return;

      try {
        setLoading(true);
        setError(null);

        const [movieResponse, tvResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
          ),
          fetch(
            `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
          )
        ]);

        const [movieData, tvData] = await Promise.all([
          movieResponse.json(),
          tvResponse.json(),
        ]);

        if (!movieResponse.ok || !tvResponse.ok) {
          throw new Error("Failed to fetch search results");
        }

        const movies = movieData.results?.map((movie: Media) => ({
          ...movie,
          media_type: "movie",
          title: movie.title || movie.name,
        })) || [];

        const tvShows = tvData.results?.map((tv: Media) => ({
          ...tv,
          media_type: "tv",
          title: tv.name || tv.title,
        })) || [];

        const combinedResults = [...movies, ...tvShows].filter(
          (item) => item.title && item.id
        );

        setMediaResults(combinedResults);
      } catch (error) {
        console.error('Search Error:', error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  
  const getGenres = (genreIds: number[]): string => {
    if (!genreIds?.length || !genres.length) return "Unknown";
    
    const genreNames = genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : null;
      })
      .filter(Boolean);
    
    return genreNames.length > 0 ? genreNames.join(", ") : "Unknown";
  };

  return (
    <div className="bg-[#121212] min-h-screen">
      <div className={`container mx-auto px-4 lg:px-8 ${isLoggedIn ? 'py-12' : 'py-24'}`}>
        <div className="mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-500">
            Search Results for "{query}"
          </h2>
        </div>

        {loading && (
          <div className="text-center text-white py-8">Loading...</div>
        )}

        {error && (
          <div className="text-center text-red-500 py-8">{error}</div>
        )}

        {!loading && !error && mediaResults.length === 0 && (
          <div className="text-center text-white py-8">
            No results found for "{query}"
          </div>
        )}

        {!loading && !error && mediaResults.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {mediaResults.map((media) => (
              <MediaCard
                key={media.id}
                id={media.id}
                title={media.title || "Unknown Title"}
                overview={media.overview}
                posterPath={media.poster_path}
                mediaType={media.media_type}
                genreIds={media.genre_ids || []}
                getGenres={getGenres}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;