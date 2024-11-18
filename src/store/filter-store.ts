import { create } from 'zustand'

interface FilterState {
  rating: number
  genre: string
  year: string
  sortBy: string
  voteCount: number
  popularity: number
  releaseDateStart: string
  releaseDateEnd: string
  isFiltersActive: boolean
  setRating: (rating: number) => void
  setGenre: (genre: string) => void
  setYear: (year: string) => void
  setSortBy: (sort: string) => void
  setVoteCount: (count: number) => void
  setPopularity: (popularity: number) => void
  setReleaseDateRange: (start: string, end: string) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  rating: 0,
  genre: 'all',
  year: 'all',
  sortBy: 'default',
  voteCount: 0,
  popularity: 0,
  releaseDateStart: '',
  releaseDateEnd: '',
  isFiltersActive: false,
  setRating: (rating) => set({ rating, isFiltersActive: true }),
  setGenre: (genre) => set({ genre, isFiltersActive: true }),
  setYear: (year) => set({ year, isFiltersActive: true }),
  setSortBy: (sortBy) => set({ sortBy }),
  setVoteCount: (voteCount) => set({ voteCount, isFiltersActive: true }),
  setPopularity: (popularity) => set({ popularity, isFiltersActive: true }),
  setReleaseDateRange: (start, end) => set({ 
    releaseDateStart: start, 
    releaseDateEnd: end, 
    isFiltersActive: true 
  }),
  resetFilters: () => set({
    rating: 0,
    genre: 'all',
    year: 'all',
    sortBy: 'default',
    voteCount: 0,
    popularity: 0,
    releaseDateStart: '',
    releaseDateEnd: '',
    isFiltersActive: false
  })
}))