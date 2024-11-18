import { FC } from 'react'
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useFilterStore } from "@/store/filter-store"
import { useEffect, useState } from "react"
import { X } from 'lucide-react'
import { Input } from "@/components/ui/input"

interface FiltersProps {
  onClose?: () => void
}

const Filters: FC<FiltersProps> = ({ onClose }) => {
  const {
    rating,
    genre,
    year,
    sortBy,
    popularity,
    releaseDateStart,
    releaseDateEnd,
    setRating,
    setGenre,
    setYear,
    setSortBy,
    setPopularity,
    setReleaseDateRange,
    resetFilters,
    isFiltersActive
  } = useFilterStore()

  const [genres, setGenres] = useState<{ id: number; name: string }[]>([])
  const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e"

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`)
        ])

        const movieData = await movieGenres.json()
        const tvData = await tvGenres.json()

        const allGenres = [...movieData.genres, ...tvData.genres]
        const uniqueGenres = Array.from(
          new Map(allGenres.map((genre) => [genre.id, genre])).values()
        )

        setGenres(uniqueGenres)
      } catch (error) {
        console.error("Error fetching genres:", error)
      }
    }

    fetchGenres()
  }, [])

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <SheetContent className="bg-[#212121] border-[#212121]">
      <SheetHeader>
        <div className="flex items-center justify-between">
          <SheetTitle className="text-white">Filters</SheetTitle>
          {isFiltersActive && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-white hover:text-red-500"
            >
              <X className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </SheetHeader>

      <div className="flex flex-col gap-6 mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Sort By</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-[#191919] border-[#191919] text-white">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent className="bg-[#191919] border-[#191919] text-white">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
              <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
              <SelectItem value="date-desc">Release Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Release Date (Oldest)</SelectItem>
              <SelectItem value="popularity-desc">Popularity (High to Low)</SelectItem>
              <SelectItem value="popularity-asc">Popularity (Low to High)</SelectItem>
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

        {/* Rating Filter */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">
            Minimum Rating: {rating}
          </label>
          <Slider
            value={[rating]}
            onValueChange={(value) => setRating(value[0])}
            min={0}
            max={10}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Release Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Release Date Range</label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={releaseDateStart}
              onChange={(e) => setReleaseDateRange(e.target.value, releaseDateEnd)}
              className="bg-[#191919] border-[#191919] text-white"
            />
            <Input
              type="date"
              value={releaseDateEnd}
              onChange={(e) => setReleaseDateRange(releaseDateStart, e.target.value)}
              className="bg-[#191919] border-[#191919] text-white"
            />
          </div>
        </div>

        {/* Popularity Filter */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">
            Minimum Popularity: {popularity}
          </label>
          <Slider
            value={[popularity]}
            onValueChange={(value) => setPopularity(value[0])}
            min={0}
            max={1000}
            step={10}
            className="w-full"
          />
        </div>

        <Button 
          onClick={onClose} 
          className="mt-4 bg-teal-600 hover:bg-teal-700"
        >
          Apply Filters
        </Button>
      </div>
    </SheetContent>
  )
}

export default Filters