import { useState, useEffect } from 'react'
import { useMovieFilterStore } from '../store/movie-filter-store'


// Common types
interface BaseContent {
  id: number
  vote_average: number
  genre_ids: number[]
  popularity: number
  original_language: string
  vote_count: number
  keywords?: number[]
}

interface MovieContent extends BaseContent {
  title: string
  release_date: string
  adult: boolean
  production_companies?: number[]
}



// Movie Filter Hook
export function useFilteredMovies(initialContent: MovieContent[]) {
  const {
    rating,
    genre,
    sortBy,
    popularity,
    releaseDateStart,
    releaseDateEnd,
    isFiltersActive,
    includeAdult,
    originalLanguage,
    withCast,
    withCrew,
    withCompanies,
    voteCount,
    withKeywords
  } = useMovieFilterStore()

  const [filteredContent, setFilteredContent] = useState<MovieContent[]>(initialContent)

  useEffect(() => {
    let filtered = [...initialContent]

    if (isFiltersActive) {
      // Basic filters
      if (rating > 0) {
        filtered = filtered.filter(item => item.vote_average >= rating)
      }

      if (genre !== 'all') {
        filtered = filtered.filter(item => 
          item.genre_ids.includes(parseInt(genre))
        )
      }

      // Date range filter
      if (releaseDateStart || releaseDateEnd) {
        filtered = filtered.filter(item => {
          if (!item.release_date) return false
          const itemDate = new Date(item.release_date)
          const start = releaseDateStart ? new Date(releaseDateStart) : new Date(0)
          const end = releaseDateEnd ? new Date(releaseDateEnd) : new Date()
          return itemDate >= start && itemDate <= end
        })
      }

      // Additional movie-specific filters
      if (!includeAdult) {
        filtered = filtered.filter(item => !item.adult)
      }

      if (originalLanguage !== 'all') {
        filtered = filtered.filter(item => 
          item.original_language === originalLanguage
        )
      }

      if (popularity > 0) {
        filtered = filtered.filter(item => item.popularity >= popularity)
      }

      if (voteCount > 0) {
        filtered = filtered.filter(item => item.vote_count >= voteCount)
      }

      // Company filter (if API provides company IDs)
      if (withCompanies && item.production_companies) {
        filtered = filtered.filter(item => 
          item.production_companies?.some(company => 
            company.toString().toLowerCase().includes(withCompanies.toLowerCase())
          )
        )
      }
    }

    // Apply sorting
    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'rating-desc':
            return b.vote_average - a.vote_average
          case 'rating-asc':
            return a.vote_average - b.vote_average
          case 'date-desc':
            return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
          case 'date-asc':
            return new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
          case 'popularity-desc':
            return b.popularity - a.popularity
          case 'popularity-asc':
            return a.popularity - b.popularity
          case 'title-asc':
            return a.title.localeCompare(b.title)
          case 'title-desc':
            return b.title.localeCompare(a.title)
          default:
            return 0
        }
      })
    }

    setFilteredContent(filtered)
  }, [
    initialContent,
    rating,
    genre,
    sortBy,
    popularity,
    releaseDateStart,
    releaseDateEnd,
    isFiltersActive,
    includeAdult,
    originalLanguage,
    withCompanies,
    voteCount,
    withKeywords
  ])

  return filteredContent
}