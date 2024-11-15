import MediaCard from "@/components/custom/MediaCard";
import Filters from "@/components/custom/Filters";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useFilterStore } from "@/store/filter-store";

interface Media {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const LatestMovies = () => {
  const [movies, setMovies] = useState<Media[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Access filter state from Zustand
  const { rating, genre, year } = useFilterStore();

// Fetch movies
useEffect(() => {
  const fetchMovies = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${pageNumber}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      const newMovies = data.results;
      setMovies((prev) => [...prev, ...newMovies]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  fetchMovies(page);
}, [page]);

  // Apply filters to movies
  useEffect(() => {
    let results = movies;
    if (rating > 0) {
      results = results.filter((movie) => movie.vote_average >= rating);
    }
    if (genre !== 'all') {
      results = results.filter((movie) =>
        movie.genre_ids.includes(Number(genre))
      );
    }
    if (year !== 'all') {
      results = results.filter((movie) => movie.release_date?.startsWith(year));
    }
    setFilteredMovies(results);
  }, [movies, rating, genre, year]);
  

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="bg-[#121212] h-full">
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-start gap-4 sm:gap-0 sm:flex-row sm:items-center justify-between mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-500">
            Latest Movies
          </h2>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <div className="text-white px-4 py-2 rounded-md text-sm bg-teal-600 cursor-pointer">
                Filters
              </div>
            </SheetTrigger>
            <Filters onClose={() => setOpen(false)} />
          </Sheet>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredMovies.map((movie) => (
            <MediaCard
              key={movie.id}
              id={movie.id.toString()}
              title={movie.title}
              overview={movie.overview}
              posterPath={movie.poster_path}
              mediaType="movie"
            />
          ))}
        </div>

        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-500"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestMovies;
