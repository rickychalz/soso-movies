import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Filters from "@/components/custom/Filters";
import MediaCard from "@/components/custom/MediaCard";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useFilterStore } from '@/store/filter-store';
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
  const [open, setOpen] = useState(false);
  const [mediaResults, setMediaResults] = useState<Media[]>([]);
  const [filteredResults, setFilteredResults] = useState<Media[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]); // Store genres to map IDs to names
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const { mediaType, rating, genre, year } = useFilterStore();

  const{isLoggedIn} = useAuthStore();

  const query = new URLSearchParams(location.search).get("query");

  // Fetch genres from TMDB to map genre IDs
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch genres");
        }
        const genreData = await response.json();
        setGenres(genreData.genres);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error fetching genres");
      }
    };

    fetchGenres();
  }, []);

  // Fetch search results for movies and TV shows
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setError(null);

        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`
        );
        const movieData = await movieResponse.json();

        const tvResponse = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${query}`
        );
        const tvData = await tvResponse.json();

        const combinedResults = [
          ...movieData.results.map((movie: Media) => ({
            ...movie,
            media_type: "movie",
          })),
          ...tvData.results.map((tv: Media) => ({ ...tv, media_type: "tv" })),
        ];

        setMediaResults(combinedResults);
        setFilteredResults(combinedResults); // Initialize with all results
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  // Filter media results based on filters
  useEffect(() => {
    let results = mediaResults;

    if (mediaType !== 'all') {
      results = results.filter(
        (media) => media.media_type === mediaType
      );
    }

    if (rating > 0) {
      results = results.filter((media) => media.vote_average >= rating);
    }

    if (genre !== 'all') {
      results = results.filter((media) =>
        media.genre_ids?.includes(Number(genre))
      );
    }

    if (year !== 'all') {
      results = results.filter((media) => {
        const releaseYear = media.release_date || media.first_air_date;
        return releaseYear?.startsWith(year);
      });
    }

    setFilteredResults(results);
  }, [mediaType, rating, genre, year, mediaResults]);

  // Helper function to get genre names from genreIds
  const getGenres = (genreIds: number[]): string => {
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : "Unknown";
      })
      .join(", ");
  };

  return (
    <div className="bg-[#121212] h-full">
      <div className={`container mx-auto px-4 lg:px-8 ${isLoggedIn ? 'py-12' : 'py-24'}`}>
        <div className="flex flex-col items-start gap-4 sm:gap-0 sm:flex-row sm:items-center justify-between mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-500">
            Search Results for "{query}"
          </h2>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <div className="text-white px-4 py-2 rounded-md text-sm bg-teal-600">
                <span className="">Filters</span>
              </div>
            </SheetTrigger>
            <Filters onClose={() => setOpen(false)} />
          </Sheet>
        </div>

        <div className="flex w-full items-center justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            {filteredResults.map((media) => (
              <MediaCard
                key={media.id}
                id={media.id}
                title={media.title || media.name}
                overview={media.overview}
                posterPath={media.poster_path}
                mediaType={media.media_type}
                genreIds={media.genre_ids}
                getGenres={getGenres} // Pass the getGenres function to map genreIds to genre names
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
