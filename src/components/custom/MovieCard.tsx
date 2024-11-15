import React from 'react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    genre_ids: number[];
    overview?: string; // Add overview (description) as an optional property
  };
  getGenres: (genreIds: number[]) => string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, getGenres }) => {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group relative block bg-black rounded-xl h-[250px] w-[150px] sm:h-[300px] sm:w-[200px]  flex-shrink-0 overflow-hidden"
    >
      <img
        alt={movie.title}
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity duration-300 ease-in-out group-hover:opacity-50"
      />
      <div className="relative py-4 px-2 sm:p-6 lg:p-4 z-10 flex flex-col justify-between h-full">
        <div className="line-clamp-5 mt-auto opacity-0 translate-y-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
          {/* Description on hover */}
          <p className="text-xs sm:text-sm text-white">
            {movie.overview || "No description available."}
          </p>
        </div>

        <div className="transition-all duration-300 ease-in-out opacity-100 group-hover:opacity-0">
          {/* Title and genre information at the bottom */}
          <p className="text-lg font-bold text-white sm:text-lg">
            {movie.title}
          </p>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            {getGenres(movie.genre_ids)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
