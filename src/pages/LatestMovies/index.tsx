import { useEffect, useState } from "react";
import MediaCard from "@/components/custom/MediaCard";
import MovieFilters from "../../components/custom/MovieFilter";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useMovieFilterStore } from "@/store/movie-filter-store";
import { useFilteredMovies } from "../../hooks/useMovieFilteredContent";
import useAuthStore from "@/store/auth-context";

interface Media {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  vote_count: number;
  adult: boolean;
  production_companies?: number[];
}

interface Genre {
  id: number;
  name: string;
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const LatestMovies = () => {
  const [movies, setMovies] = useState<Media[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { isLoggedIn } = useAuthStore();
  const { isFiltersActive } = useMovieFilterStore();
  
  // Use the custom hook for filtering
  const filteredMovies = useFilteredMovies(movies);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) throw new Error("Failed to fetch genres");
        const genreData = await response.json();
        setGenres(genreData.genres);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching genres");
      }
    };

    fetchGenres();
  }, []);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async (pageNumber: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${pageNumber}`
        );
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        
        const transformedMovies = data.results.map((movie: any) => ({
          ...movie,
          production_companies: movie.production_company_ids || [],
          keywords: movie.keyword_ids || []
        }));

        // Update movies while removing duplicates
        setMovies(prevMovies => {
          const newMovies = [...prevMovies];
          transformedMovies.forEach(movie => {
            if (!newMovies.some(existing => existing.id === movie.id)) {
              newMovies.push(movie);
            }
          });
          return newMovies;
        });

        // Check if we've reached the end of available movies
        setHasMore(data.page < data.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies(page);
  }, [page]);

  // Helper function to get genre names
  const getGenres = (genreIds: number[]) => {
    return genreIds
      .map(id => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : "Unknown";
      })
      .join(", ");
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="bg-[#121212] min-h-screen">
      <div className={`container mx-auto ${isLoggedIn ? 'py-10 px-8' : 'py-24 px-4'}`}>
        <div className="flex flex-col items-start gap-4 sm:gap-0 sm:flex-row sm:items-center justify-between mb-12">
          <h2 className={`text-xl ${isLoggedIn ? 'sm:text-2xl' : 'sm:text-3xl'} font-bold text-gray-500`}>
            Latest Movies {isFiltersActive && '(Filtered)'}
          </h2>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="text-white px-4 py-2 rounded-md text-sm bg-teal-600 hover:bg-teal-700">
                Filters
              </button>
            </SheetTrigger>
            <MovieFilters onClose={() => setOpen(false)} />
          </Sheet>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredMovies.map(movie => (
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

        {loading && (
          <div className="text-center text-gray-500 mt-8">
            Loading...
          </div>
        )}

        {!loading && !error && filteredMovies.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Load More
            </button>
          </div>
        )}

        {!loading && !error && filteredMovies.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No movies found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestMovies;