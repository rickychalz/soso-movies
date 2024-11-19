import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";


const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";


type Slide = {
  title: string;
  image: string;
  genres: string[];
  releaseYear: string;
  duration: number | null; // Duration can be null for TV shows
  description: string;
  category: string;
};

const logos = [
  { logo: "/disney.png" },
  { logo: "/hbomax.jpg" },
  { logo: "/netflix.png" },
  { logo: "/huluu.png" },
  { logo: "/peacock.png" },
  { logo: "/marvel.png" },
];

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [slidesData, setSlidesData] = useState<Slide[]>([]);

  useEffect(() => {
    // Fetch the trending movies from TMDB API
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
        );
        const data = await response.json();
        const trendingMovies = data.results.slice(0, 5); 

        // Fetch additional data for each movie
        const movieDetailsPromises = trendingMovies.map(async (movie: any) => {
          const movieDetailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=credits,genres`
          );
          const movieDetails = await movieDetailsResponse.json();

          const genres = movieDetails.genres.map((genre: any) => genre.name);
          const duration = movieDetails.runtime || null; 
          const description =
            movieDetails.overview || "No description available.";
          const category = movieDetails.tv_show ? "TV Show" : "Movie";

          return {
            title: movieDetails.title || movieDetails.name,
            image: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,
            genres,
            releaseYear: movieDetails.release_date
              ? movieDetails.release_date.split("-")[0]
              : "N/A",
            duration,
            description,
            category,
          };
        });

       
        const movieDetails = await Promise.all(movieDetailsPromises);
        setSlidesData(movieDetails);
      } catch (error) {
        console.error("Error fetching trending movies: ", error);
      }
    };

    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()); 
    }
  }, [emblaApi]);

  return (
    <div className="hero-container h-screen flex flex-col bg-[#121212]">
      {/* Carousel occupying 3/4 of the screen */}
      <div className="embla overflow-hidden h-4/5" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slidesData.map((slide, index) => (
            <div
              key={index}
              className="embla__slide relative min-w-0 flex-none w-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent"></div>
              {/* Slide content */}
              <div className="relative z-10 flex items-center justify-start h-full bg-transparent mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-0 pt-48 lg:pt-56">
                <div className="text-white px-4 max-w-2xl">
                  <span className="rounded-full px-4 py-1.5 bg-teal-600 text-xs">
                    {slide.category}
                  </span>
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mt-3 ">
                    {slide.title}
                  </h1>
                  <div className="flex gap-2 text-xs text-gray-500 items-center md:mt-3 ">
                    <span>
                      {slide.duration ? `${slide.duration} mins` : "N/A"}
                    </span>
                    <span>{slide.releaseYear}</span>
                    <span>{slide.genres.join(" | ")}</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-400 font-light mt-2 line-clamp-5">
                    {slide.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 md:mt-6 text-sm">
                    <div className="rounded-lg bg-teal-600 px-4 py-3 text-xs sm:text-sm">
                      Watch trailer
                    </div>
                    <div className="rounded-lg border border-white px-4 py-3 text-xs sm:text-sm">
                      Add to Watchlist
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logo section occupying 1/5 of the screen */}
      <div className="logo-section h-1/5 flex w-full justify-center bg-[#121212] py-6 md:py-10">
        <div className="flex space-x-6 gap-3 md:gap-8 items-center justify-between overflow-x-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-0 scrollbar-hide">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo.logo}
              alt={logo.logo}
              className="h-12 md:h-16"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
