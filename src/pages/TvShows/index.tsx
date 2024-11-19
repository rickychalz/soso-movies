import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { useTvShowFilterStore } from '../../store/tv-filter-store';
import TvShowFilters from '../../components/custom/TvShowFilter';
import MediaCard from "../../components/custom/MediaCard";


interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  vote_count: number;
  status?: string;
  type?: string;
}

interface Genre {
  id: number;
  name: string;
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const TVShowsPage = () => {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const {
    rating,
    genre,
    sortBy,
    popularity,
    firstAirDateStart,
    firstAirDateEnd,
    isFiltersActive,
    originalLanguage,
    withCast,
    withCrew,
    withNetworks,
    voteCount,
    withKeywords,
    status,
    type,
    resetFilters
  } = useTvShowFilterStore();

  // Fetch TV shows with filters
  useEffect(() => {
    const fetchTVShows = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&page=${page}`;

        // Add filters to URL
        if (isFiltersActive) {
          if (rating > 0) url += `&vote_average.gte=${rating}`;
          if (genre !== 'all') url += `&with_genres=${genre}`;
          if (popularity > 0) url += `&popularity.gte=${popularity}`;
          if (firstAirDateStart) url += `&first_air_date.gte=${firstAirDateStart}`;
          if (firstAirDateEnd) url += `&first_air_date.lte=${firstAirDateEnd}`;
          if (originalLanguage !== 'all') url += `&with_original_language=${originalLanguage}`;
          if (voteCount > 0) url += `&vote_count.gte=${voteCount}`;
          if (withCast) url += `&with_cast=${withCast}`;
          if (withCrew) url += `&with_crew=${withCrew}`;
          if (withNetworks) url += `&with_networks=${withNetworks}`;
          if (withKeywords) url += `&with_keywords=${withKeywords}`;
          if (status !== 'all') url += `&status=${status}`;
          if (type !== 'all') url += `&type=${type}`;
        }

        // Add sorting
        switch (sortBy) {
          case 'popularity-desc':
            url += '&sort_by=popularity.desc';
            break;
          case 'popularity-asc':
            url += '&sort_by=popularity.asc';
            break;
          case 'rating-desc':
            url += '&sort_by=vote_average.desc';
            break;
          case 'rating-asc':
            url += '&sort_by=vote_average.asc';
            break;
          case 'first-air-date-desc':
            url += '&sort_by=first_air_date.desc';
            break;
          case 'first-air-date-asc':
            url += '&sort_by=first_air_date.asc';
            break;
          case 'title-asc':
            url += '&sort_by=name.asc';
            break;
          case 'title-desc':
            url += '&sort_by=name.desc';
            break;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch TV shows');

        const data = await response.json();
        
        if (page === 1) {
          setShows(data.results);
        } else {
          // Remove duplicates when adding new shows
          const newShows = data.results;
          setShows(prev => {
            const existingIds = new Set(prev.map(show => show.id));
            const uniqueNewShows = newShows.filter(show => !existingIds.has(show.id));
            return [...prev, ...uniqueNewShows];
          });
        }

        setHasMore(data.page < data.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [page, isFiltersActive, rating, genre, sortBy, popularity, firstAirDateStart, 
      firstAirDateEnd, originalLanguage, voteCount, withCast, withCrew, 
      withNetworks, withKeywords, status, type]);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) throw new Error('Failed to fetch genres');
        const data = await response.json();
        setGenres(data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

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
      setPage(prev => prev + 1);
    }
  };

  const handleFiltersClose = () => {
    setPage(1);
    setShows([]);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-8 text-gray-500">
            {isFiltersActive ? 'Filtered TV Shows' : 'All TV Shows'}
          </h1>
          <div className="flex items-center gap-4">
            {isFiltersActive && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  resetFilters();
                  setPage(1);
                  setShows([]);
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
              <TvShowFilters onClose={handleFiltersClose} />
            </Sheet>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {shows.map((show) => (
            <MediaCard
              key={`${show.id}-${show.name}`}
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

        {shows.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            {isFiltersActive ? 'No shows match your filters' : 'No shows found'}
          </div>
        )}

        {hasMore && !isFiltersActive && (
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

export default TVShowsPage;