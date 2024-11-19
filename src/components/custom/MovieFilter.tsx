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
import { useMovieFilterStore } from '../../store/movie-filter-store'
import { useEffect, useState } from "react"
import { X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface MovieFiltersProps {
  onClose?: () => void
}

const MovieFilters: FC<MovieFiltersProps> = ({ onClose }) => {
  const {
    rating,
    genre,
    sortBy,
    popularity,
    releaseDateStart,
    releaseDateEnd,
    setRating,
    setGenre,
    setSortBy,
    setPopularity,
    setReleaseDateRange,
    resetFilters,
    isFiltersActive,
    includeAdult,
    setIncludeAdult,
    originalLanguage,
    setOriginalLanguage,
    withCast,
    setWithCast,
    withCrew,
    setWithCrew,
    withCompanies,
    setWithCompanies,
    voteCount,
    setVoteCount,
    withKeywords,
    setWithKeywords
  } = useMovieFilterStore()

  const [genres, setGenres] = useState<{ id: number; name: string }[]>([])
  const [languages, setLanguages] = useState<{ iso_639_1: string; english_name: string }[]>([])
  const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e"

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        )
        const data = await response.json()
        setGenres(data.genres)
      } catch (error) {
        console.error("Error fetching genres:", error)
      }
    }

    const fetchLanguages = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`
        )
        const data = await response.json()
        setLanguages(data)
      } catch (error) {
        console.error("Error fetching languages:", error)
      }
    }

    fetchGenres()
    fetchLanguages()
  }, [])

  return (
    <SheetContent className="bg-[#212121] border-[#212121]">
      <SheetHeader>
        <div className="flex items-center justify-between">
          <SheetTitle className="text-white">Movie Filters</SheetTitle>
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
              <SelectItem value="popularity-desc">Popularity Descending</SelectItem>
              <SelectItem value="popularity-asc">Popularity Ascending</SelectItem>
              <SelectItem value="rating-desc">Rating Descending</SelectItem>
              <SelectItem value="rating-asc">Rating Ascending</SelectItem>
              <SelectItem value="date-desc">Release Date Descending</SelectItem>
              <SelectItem value="date-asc">Release Date Ascending</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
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

        {/* Language Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Original Language</label>
          <Select value={originalLanguage} onValueChange={setOriginalLanguage}>
            <SelectTrigger className="bg-[#191919] border-[#191919] text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-[#191919] border-[#191919] text-white">
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang.iso_639_1} value={lang.iso_639_1}>
                  {lang.english_name}
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

        {/* Vote Count Filter */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">
            Minimum Vote Count: {voteCount}
          </label>
          <Slider
            value={[voteCount]}
            onValueChange={(value) => setVoteCount(value[0])}
            min={0}
            max={500}
            step={50}
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

        {/* Additional Filters */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">Additional Filters</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeAdult"
                checked={includeAdult}
                onCheckedChange={(checked) => setIncludeAdult(checked as boolean)}
              />
              <label htmlFor="includeAdult" className="text-sm text-white">
                Include Adult Content
              </label>
            </div>
          </div>
        </div>

        {/* Cast & Crew Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Cast & Crew</label>
          <Input
            placeholder="Search by cast member"
            value={withCast}
            onChange={(e) => setWithCast(e.target.value)}
            className="bg-[#191919] border-[#191919] text-white"
          />
          <Input
            placeholder="Search by crew member"
            value={withCrew}
            onChange={(e) => setWithCrew(e.target.value)}
            className="bg-[#191919] border-[#191919] text-white mt-2"
          />
        </div>

        {/* Production Companies */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Production Companies</label>
          <Input
            placeholder="Search by company"
            value={withCompanies}
            onChange={(e) => setWithCompanies(e.target.value)}
            className="bg-[#191919] border-[#191919] text-white"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Keywords</label>
          <Input
            placeholder="Search by keywords"
            value={withKeywords}
            onChange={(e) => setWithKeywords(e.target.value)}
            className="bg-[#191919] border-[#191919] text-white"
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


export default MovieFilters