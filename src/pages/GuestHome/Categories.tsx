import { useState, useEffect } from "react";

interface Genre {
  id: number;
  name: string;
}

interface GenreResponse {
  genres: Genre[];
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const MovieTVCategories = () => {
  const [categories, setCategories] = useState<Genre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setError(null);

        // Fetch movie genres
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );

        if (!genreResponse.ok) {
          throw new Error('Failed to fetch movie genres');
        }

        const genreData: GenreResponse = await genreResponse.json();
        setCategories(genreData.genres);

      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="py-12 bg-[#121212]">
      <div className="flex flex-col items-start mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-0">
        <div className="text-white mb-8 flex items-center justify-between w-full">
          <span className="text-3xl font-bold">Categories</span>
          <span>See all</span>
        </div>
        
        <div className="w-full overflow-hidden">
          <div
            className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {categories.map((category) => (
              <a
                href="#"
                key={category.id}
                className="group relative block bg-teal-600/20 rounded-xl h-[80px] w-[200px] flex-shrink-0 overflow-hidden"
              >
                <div className="relative p-4 sm:p-6 lg:p-4 z-10 flex items-center justify-center h-full">
                  <p className="text-xl font-bold text-white text-center">
                    {category.name}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieTVCategories;
