import { useState, useEffect } from 'react'
import { useFilterStore } from '@/store/filter-store'

interface FilterableContent {
  id: number
  title?: string
  name?: string
  vote_average: number
  genre_ids: number[]
  release_date?: string
  first_air_date?: string
  popularity: number
  media_type?: 'movie' | 'tv'
}

export function useFilteredContent<T extends FilterableContent>(initialContent: T[]) {
  const {
    rating,
    genre,
    year,
    sortBy,
    popularity,
    releaseDateStart,
    releaseDateEnd,
    isFiltersActive
  } = useFilterStore()

  const [filteredContent, setFilteredContent] = useState<T[]>(initialContent)

  useEffect(() => {
    let filtered = [...initialContent]

    if (isFiltersActive) {
      // Filter by rating (vote_average)
      if (rating > 0) {
        filtered = filtered.filter(item => item.vote_average >= rating)
      }

      // Filter by genre
      if (genre !== 'all') {
        filtered = filtered.filter(item => 
          item.genre_ids.includes(parseInt(genre))
        )
      }

      // Filter by date range
      if (releaseDateStart || releaseDateEnd) {
        filtered = filtered.filter(item => {
          const date = item.release_date || item.first_air_date
          if (!date) return false
          
          const itemDate = new Date(date)
          const start = releaseDateStart ? new Date(releaseDateStart) : new Date(0)
          const end = releaseDateEnd ? new Date(releaseDateEnd) : new Date()
          
          return itemDate >= start && itemDate <= end
        })
      }

      // Filter by popularity
      if (popularity > 0) {
        filtered = filtered.filter(item => item.popularity >= popularity)
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
            return new Date(b.release_date || b.first_air_date || '').getTime() -
                   new Date(a.release_date || a.first_air_date || '').getTime()
          case 'date-asc':
            return new Date(a.release_date || a.first_air_date || '').getTime() -
                   new Date(b.release_date || b.first_air_date || '').getTime()
          case 'popularity-desc':
            return b.popularity - a.popularity
          case 'popularity-asc':
            return a.popularity - b.popularity
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
    year,
    sortBy,
    popularity,
    releaseDateStart,
    releaseDateEnd,
    isFiltersActive
  ])

  return filteredContent
}