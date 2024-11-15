// components/custom/Filters.tsx
import { FC } from 'react';
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/store/filter-store";
import { useEffect, useState } from "react";

interface FiltersProps {
  onClose?: () => void;
}

const Filters: FC<FiltersProps> = ({ onClose }) => {  // Changed to FC and added return statement
  const { mediaType, rating, genre, year, setMediaType, setRating, setGenre, setYear } =
    useFilterStore();

  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`),
        ]);

        const movieData = await movieGenres.json();
        const tvData = await tvGenres.json();

        const allGenres = [...movieData.genres, ...tvData.genres];
        const uniqueGenres = Array.from(
          new Map(allGenres.map((genre) => [genre.id, genre])).values()
        );

        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleApplyFilters = () => {
    onClose?.();
  };

  return (  // Added return statement
    <SheetContent className="bg-[#212121] border-[#212121]">
      <SheetHeader>
        <SheetTitle className="text-white">Filter</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col gap-6 mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
        {/* Content Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Content Type</label>
          <Select value={mediaType} onValueChange={setMediaType}>
            <SelectTrigger className="bg-[#191919] border-[#191919] text-white">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent className="bg-[#191919] border-[#191919] text-white">
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="tv">TV Shows</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Genre Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Genre</label>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger className="bg-[#191919] border-[#191919] text-white">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className="bg-[#191919] border-[#191919] text-white">
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Release Year</label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="bg-[#191919] border-[#191919] text-white">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-[#191919] border-[#191919] text-white max-h-[200px]">
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Minimum Rating</label>
          <Select value={rating.toString()} onValueChange={(val) => setRating(Number(val))}>
            <SelectTrigger className="bg-[#191919] border-[#191919] text-white">
              <SelectValue placeholder="Select minimum rating" />
            </SelectTrigger>
            <SelectContent className="bg-[#191919] border-[#191919] text-white">
              <SelectItem value="0">All Ratings</SelectItem>
              <SelectItem value="5">5+ Stars</SelectItem>
              <SelectItem value="6">6+ Stars</SelectItem>
              <SelectItem value="7">7+ Stars</SelectItem>
              <SelectItem value="8">8+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleApplyFilters} className="mt-4 bg-teal-600 hover:bg-teal-700">
          Apply Filters
        </Button>
      </div>
    </SheetContent>
  );
};

export default Filters;