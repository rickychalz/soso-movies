// SearchResults.tsx
import Filters from "@/components/custom/Filters";
import MediaCard from "@/components/custom/MediaCard";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {useFilterStore} from '@/store/filter-store';

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

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const SearchResults = () => {
  const [open, setOpen] = useState(false);
  const [mediaResults, setMediaResults] = useState<Media[]>([]);
  const [filteredResults, setFilteredResults] = useState<Media[]>([]);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const { mediaType, rating, genre, year, setMediaType, setRating, setGenre, setYear } = useFilterStore();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setError(null);

        // Fetch movies and TV shows
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

  return (
    <div className="bg-[#121212] h-full">
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-start gap-4 sm:gap-0 sm:flex-row sm:items-center justify-between mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-500">
            Search Results for "{query}"
          </h2>
          <Sheet>
            <SheetTrigger asChild>
              <div className="text-white px-4 py-2 rounded-md text-sm bg-teal-600">
                <span className="">Filters</span>
              </div>
            </SheetTrigger>
            <Filters
              onClose={() => setOpen(false)}
            />
          </Sheet>
        </div>

        <div className="flex w-full justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
            {filteredResults.map((media) => (
              <MediaCard
                key={media.id}
                id={media.id.toString()}
                title={media.title || media.name}
                overview={media.overview}
                posterPath={media.poster_path}
                mediaType={media.media_type}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;