import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import MediaCard from "@/components/custom/MediaCard"; // Import MediaCard from TrendingShows
import { useFilteredContent } from '@/hooks/use-fiilteredContent';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import Filters from '@/components/custom/Filters';
import { useFilterStore } from '@/store/filter-store';

// Types
interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
}

interface Genre {
  id: number
  name: string
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const TVShows = () => {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([])
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { isFiltersActive, resetFilters } = useFilterStore()

  // Use the filtering hook with the movies data
  const filteredMovies = useFilteredContent<TVShow>(TVShows)

  useEffect(() => {
    const fetchTVShows = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch TV shows');
        }

        const data = await response.json();
        
        if (page === 1) {
          setShows(data.results);
        } else {
          setShows((prev) => [...prev, ...data.results]);
        }

        setHasMore(data.page < data.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [page]);

  // Fetch genres for all TV shows
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch genres');
        }

        const genreData = await response.json();
        setGenres(genreData.genres);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

    // Reset page when filters change
    useEffect(() => {
      setPage(1)
      setShows([])
    }, [isFiltersActive])
  
  // Function to get genre names from genre IDs
  const getGenres = (genreIds: number[]) => {
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : "Unknown";
      })
      .join(", ");
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleFiltersClose = () => {
    // If we want to refresh the data when filters are applied
    setPage(1)
    setShows([])
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-8 text-gray-500">{isFiltersActive ? 'Filtered Movies' : 'All TVShows'}</h1>
          <div className="flex items-center gap-4">
            {isFiltersActive && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  resetFilters()
                  setPage(1)
                  setShows([])
                }}
                className="text-white hover:text-red-500"
              >
                Reset Filters
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Filters
                </Button>
              </SheetTrigger>
              <Filters onClose={handleFiltersClose} />
            </Sheet>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMovies.map((show) => (
            <MediaCard
              key={show.id}
              id={show.id}
              title={show.name}
              overview={show.overview}
              posterPath={show.poster_path}
              genreIds={show.genre_ids}
              mediaType="tv"
              getGenres={getGenres}
            />
          ))}
        </div>

        {filteredMovies.length === 0 && !loading && (
           <div className="text-center py-8 text-gray-400">
           {isFiltersActive ? 'No shows match your filters' : 'No shows found'}
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

export default TVShows;