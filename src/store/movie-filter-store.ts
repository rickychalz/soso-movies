import { create } from 'zustand'

interface MovieFilterState {
  rating: number
  genre: string
  sortBy: string
  popularity: number
  releaseDateStart: string
  releaseDateEnd: string
  isFiltersActive: boolean
  includeAdult: boolean
  originalLanguage: string
  withCast: string
  withCrew: string
  withCompanies: string
  voteCount: number
  withKeywords: string
  
  setRating: (rating: number) => void
  setGenre: (genre: string) => void
  setSortBy: (sort: string) => void
  setPopularity: (popularity: number) => void
  setReleaseDateRange: (start: string, end: string) => void
  setIncludeAdult: (include: boolean) => void
  setOriginalLanguage: (language: string) => void
  setWithCast: (cast: string) => void
  setWithCrew: (crew: string) => void
  setWithCompanies: (companies: string) => void
  setVoteCount: (count: number) => void
  setWithKeywords: (keywords: string) => void
  resetFilters: () => void
}

export const useMovieFilterStore = create<MovieFilterState>((set) => ({
  rating: 0,
  genre: 'all',
  sortBy: 'popularity-desc',
  popularity: 0,
  releaseDateStart: '',
  releaseDateEnd: '',
  isFiltersActive: false,
  includeAdult: false,
  originalLanguage: 'all',
  withCast: '',
  withCrew: '',
  withCompanies: '',
  voteCount: 0,
  withKeywords: '',

  setRating: (rating) => set({ rating, isFiltersActive: true }),
  setGenre: (genre) => set({ genre, isFiltersActive: true }),
  setSortBy: (sortBy) => set({ sortBy }),
  setPopularity: (popularity) => set({ popularity, isFiltersActive: true }),
  setReleaseDateRange: (start, end) => set({
    releaseDateStart: start,
    releaseDateEnd: end,
    isFiltersActive: true
  }),
  setIncludeAdult: (includeAdult) => set({ includeAdult, isFiltersActive: true }),
  setOriginalLanguage: (originalLanguage) => set({ originalLanguage, isFiltersActive: true }),
  setWithCast: (withCast) => set({ withCast, isFiltersActive: true }),
  setWithCrew: (withCrew) => set({ withCrew, isFiltersActive: true }),
  setWithCompanies: (withCompanies) => set({ withCompanies, isFiltersActive: true }),
  setVoteCount: (voteCount) => set({ voteCount, isFiltersActive: true }),
  setWithKeywords: (withKeywords) => set({ withKeywords, isFiltersActive: true }),
  
  resetFilters: () => set({
    rating: 0,
    genre: 'all',
    sortBy: 'popularity-desc',
    popularity: 0,
    releaseDateStart: '',
    releaseDateEnd: '',
    isFiltersActive: false,
    includeAdult: false,
    originalLanguage: 'all',
    withCast: '',
    withCrew: '',
    withCompanies: '',
    voteCount: 0,
    withKeywords: ''
  })
}))