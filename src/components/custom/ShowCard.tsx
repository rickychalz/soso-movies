import React from 'react';
import { Link } from 'react-router-dom';

interface ShowCardProps {
  show: {
    id: number;
    name: string;
    poster_path: string;
    genre_ids: number[];
    overview?: string;
  };
  getGenres: (genreIds: number[]) => string; // Function to retrieve genre names
}

const ShowCard: React.FC<ShowCardProps> = ({ show, getGenres }) => {
  return (
    <Link
      to={`/tv/${show.id}`} // Adjusted path for TV shows
      className="group relative block bg-black rounded-xl h-[250px] w-[150px] sm:h-[300px] sm:w-[200px]  flex-shrink-0 overflow-hidden"
    >
      <img
        alt={show.name}
        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity duration-300 ease-in-out group-hover:opacity-50"
      />
      <div className="relative py-4 px-2 sm:p-6 lg:p-4 z-10 flex flex-col justify-between h-full">
        <div className="flex flex-col justify-between h-full">
          <div className="line-clamp-5 mt-auto opacity-0 translate-y-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
            <p className="text-xs sm:text-sm text-white">
              {show.overview || "No description available."}
            </p>
          </div>

          <div className="transition-all duration-300 ease-in-out opacity-100 group-hover:opacity-0">
            <p className="text-lg font-bold text-white sm:text-lg">
              {show.name}
            </p>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              {getGenres(show.genre_ids)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShowCard;
