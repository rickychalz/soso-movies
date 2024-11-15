import { Link } from "react-router-dom";

interface MediaCardProps {
  id: string; // Add id prop for unique media identification
  title: string;
  overview: string;
  posterPath: string;
  mediaType: "movie" | "tv";
}

const MediaCard = ({
  id,
  title,
  overview,
  posterPath,
  mediaType,
}: MediaCardProps) => {
  return (
    <Link
      to={`/media/${mediaType}/${id}`} // Correct the link format to include mediaType and id
      className="group relative block bg-black rounded-xl h-[250px] w-[150px] sm:h-[300px] sm:w-[200px] flex-shrink-0 overflow-hidden"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity duration-300 ease-in-out group-hover:opacity-50"
      />
      <div className="relative py-4 px-2 sm:p-6 lg:p-4 z-10 flex flex-col justify-between h-full">
        <div className="line-clamp-5 mt-auto opacity-0 translate-y-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
          {/* Description on hover */}
          <p className="text-xs sm:text-sm text-white">
            {overview || "No description available."}
          </p>
        </div>

        <div className="transition-all duration-300 ease-in-out opacity-100 group-hover:opacity-0">
          {/* Title and media type at the bottom */}
          <span className="rounded-full px-3 py-1 bg-teal-600 text-xs text-white">
            {mediaType}
          </span>
          <p className="text-lg font-bold text-white sm:text-lg">{title}</p>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
