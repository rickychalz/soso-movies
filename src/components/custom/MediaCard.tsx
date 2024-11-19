import React from 'react';
import { Link } from 'react-router-dom';

interface MediaCardProps {
  id: number; 
  title: string;
  overview: string;
  posterPath: string;
  genreIds: number[];
  mediaType: 'movie' | 'tv'; 
  getGenres: (genreIds: number[]) => string; 
}

const MediaCard: React.FC<MediaCardProps> = ({
  id,
  title,
  overview,
  posterPath,
  genreIds,
  mediaType,
  getGenres,
}) => {
  // URL for the media item (movie or TV show)
  const mediaLink = `/media/${mediaType}/${id}`;
  // Determine if it is a movie or a TV show
  const mediaTitle = mediaType === 'movie' ? title : title;
  const releaseDate = mediaType === 'movie' ? 'Release Date' : 'First Air Date';
  const mediaOverview = overview || "No description available."; 

  return (
    <Link
      to={mediaLink}
      className="group relative block bg-black rounded-xl h-[250px] w-full sm:h-[300px] sm:w-[210px] flex-shrink-0 overflow-hidden"
    >
      {/* Poster Image */}
      <img
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={mediaTitle}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity duration-300 ease-in-out group-hover:opacity-50"
      />
      
      <div className="relative py-4 px-2 sm:p-6 lg:p-4 z-10 flex flex-col justify-between h-full">
        {/* Description on hover */}
        <div className="line-clamp-5 mt-auto opacity-0 translate-y-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
          <p className="text-xs sm:text-sm text-white">
            {mediaOverview}
          </p>
        </div>

        {/* Title and genre information at the bottom */}
        <div className="transition-all duration-300 ease-in-out opacity-100 group-hover:opacity-0">
          <p className="text-lg font-bold text-white sm:text-lg">
            {mediaTitle}
          </p>
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
            {getGenres(genreIds)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
