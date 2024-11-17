import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MediaCard from "@/components/custom/MediaCard"; // Import the unified MediaCard

interface Genre {
  id: number;
  name: string;
}

interface TVShow {
  id: number;
  name: string;
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

interface TVShowResponse {
  page: number;
  results: TVShow[];
  total_results: number;
  total_pages: number;
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const TrendingShows = () => {
  const [trendingShows, setTrendingShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingShows = async () => {
      try {
        setError(null);

        // Fetch trending TV shows (most popular this week)
        const showResponse = await fetch(
          `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}&language=en-US`
        );

        if (!showResponse.ok) {
          throw new Error("Failed to fetch trending shows");
        }

        const data: TVShowResponse = await showResponse.json();
        // Limit to first 10 shows
        setTrendingShows(data.results.slice(0, 10));

        // Fetch genres
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
        );

        if (!genreResponse.ok) {
          throw new Error("Failed to fetch genres");
        }

        const genreData = await genreResponse.json();
        setGenres(genreData.genres);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching trending shows:", error);
      }
    };

    fetchTrendingShows();
  }, []);

  // Function to get genres names from genreIds
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
    <div className="py-4 bg-[#121212]">
      <div className="flex flex-col items-start mx-auto overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="text-white mb-8 flex items-center justify-between w-full">
          <span className="text-2xl font-bold text-gray-500">Trending Shows</span>
          <span className="text-teal-500">See all</span>
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
            {trendingShows.map((show) => (
              <MediaCard
                key={show.id}
                id={show.id}
                title={show.name}
                overview={show.overview}
                posterPath={show.poster_path}
                genreIds={show.genre_ids}
                mediaType="tv" // Always "tv" because this is for TV shows
                getGenres={getGenres} // Pass the getGenres function to map genre IDs to genre names
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingShows;
