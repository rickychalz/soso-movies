import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import MediaCard from "@/components/custom/MediaCard"; // Import MediaCard

// Types for Movie
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  genre_ids: number[]; // Genre IDs
  vote_average: number;
  release_date: string;
}

interface Genre {
  id: number;
  name: string;
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]); // Store genres
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );

        if (!genreResponse.ok) {
          throw new Error('Failed to fetch genres');
        }

        const genreData = await genreResponse.json();
        setGenres(genreData.genres);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching genres');
      }
    };

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch movies from the API
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        
        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies(prev => [...prev, ...data.results]);
        }

        setHasMore(data.page < data.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching movies');
      } finally {
        setLoading(false);
      }
    };

    // Fetch genres and movies together
    fetchGenres();
    fetchMovies();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Helper function to get genre names from genreIds
  const getGenres = (genreIds: number[]) => {
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : 'Unknown';
      })
      .join(', ');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className='flex items-center justify-between'>
          <h1 className="text-2xl font-bold mb-8 text-gray-500">All Movies</h1>
        </div>

        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MediaCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              overview={movie.overview}
              posterPath={movie.poster_path}
              genreIds={movie.genre_ids} // Pass genre IDs to MediaCard
              mediaType="movie" // Specify media type as "movie"
              getGenres={getGenres} // Pass getGenres function to get genre names
            />
          ))}
        </div>

        {movies.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            No movies found
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMore}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
