import { useTvShowFilterStore } from '../store/tv-filter-store'
import { useState, useEffect } from 'react'

interface BaseContent {
    id: number
    vote_average: number
    genre_ids: number[]
    popularity: number
    original_language: string
    vote_count: number
    keywords?: number[]
  }

  interface TvShowContent extends BaseContent {
    name: string
    first_air_date: string
    status?: string
    type?: string
    networks?: number[]
  }

export function useFilteredTvShows(initialContent: TvShowContent[]) {
    const {
      rating,
      genre,
      sortBy,
      popularity,
      firstAirDateStart,
      firstAirDateEnd,
      isFiltersActive,
      originalLanguage,
      withCast,
      withCrew,
      withNetworks,
      voteCount,
      withKeywords,
      status,
      type
    } = useTvShowFilterStore()
  
    const [filteredContent, setFilteredContent] = useState<TvShowContent[]>(initialContent)
  
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
        if (firstAirDateStart || firstAirDateEnd) {
          filtered = filtered.filter(item => {
            if (!item.first_air_date) return false
            const itemDate = new Date(item.first_air_date)
            const start = firstAirDateStart ? new Date(firstAirDateStart) : new Date(0)
            const end = firstAirDateEnd ? new Date(firstAirDateEnd) : new Date()
            return itemDate >= start && itemDate <= end
          })
        }
  
        // Additional TV filters
        if (status !== 'all') {
          filtered = filtered.filter(item => item.status === status)
        }
  
        if (type !== 'all') {
          filtered = filtered.filter(item => item.type === type)
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
  
        // Network filter 
        if (withNetworks && item.networks) {
          filtered = filtered.filter(item => 
            item.networks?.some(network => 
              network.toString().toLowerCase().includes(withNetworks.toLowerCase())
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
            case 'first-air-date-desc':
              return new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime()
            case 'first-air-date-asc':
              return new Date(a.first_air_date).getTime() - new Date(b.first_air_date).getTime()
            case 'popularity-desc':
              return b.popularity - a.popularity
            case 'popularity-asc':
              return a.popularity - b.popularity
            case 'title-asc':
              return a.name.localeCompare(b.name)
            case 'title-desc':
              return b.name.localeCompare(a.name)
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
      firstAirDateStart,
      firstAirDateEnd,
      isFiltersActive,
      originalLanguage,
      withNetworks,
      voteCount,
      withKeywords,
      status,
      type
    ])
  
    return filteredContent
  }