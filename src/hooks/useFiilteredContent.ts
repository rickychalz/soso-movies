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
}

export function useFilteredContent<T extends FilterableContent>(initialContent: T[]) {
  const {
    rating,
    genre,
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
      // Filter by rating
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
          const date = item.first_air_date || item.release_date
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

    // Apply sorting regardless of filter status
    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        const getDate = (item: FilterableContent) => {
          const date = item.first_air_date || item.release_date
          return date ? new Date(date).getTime() : 0
        }

        switch (sortBy) {
          case 'rating-desc':
            return b.vote_average - a.vote_average
          case 'rating-asc':
            return a.vote_average - b.vote_average
          case 'date-desc':
            return getDate(b) - getDate(a)
          case 'date-asc':
            return getDate(a) - getDate(b)
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
    sortBy,
    popularity,
    releaseDateStart,
    releaseDateEnd,
    isFiltersActive
  ])

  return filteredContent
}