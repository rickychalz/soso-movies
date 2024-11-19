import { create } from 'zustand'

interface TvShowFilterState {
  rating: number
  genre: string
  sortBy: string
  popularity: number
  firstAirDateStart: string
  firstAirDateEnd: string
  isFiltersActive: boolean
  originalLanguage: string
  withCast: string
  withCrew: string
  withNetworks: string
  voteCount: number
  withKeywords: string
  status: string
  type: string
  
  setRating: (rating: number) => void
  setGenre: (genre: string) => void
  setSortBy: (sort: string) => void
  setPopularity: (popularity: number) => void
  setFirstAirDateRange: (start: string, end: string) => void
  setOriginalLanguage: (language: string) => void
  setWithCast: (cast: string) => void
  setWithCrew: (crew: string) => void
  setWithNetworks: (networks: string) => void
  setVoteCount: (count: number) => void
  setWithKeywords: (keywords: string) => void
  setStatus: (status: string) => void
  setType: (type: string) => void
  resetFilters: () => void
}

export const useTvShowFilterStore = create<TvShowFilterState>((set) => ({
  rating: 0,
  genre: 'all',
  sortBy: 'popularity-desc',
  popularity: 0,
  firstAirDateStart: '',
  firstAirDateEnd: '',
  isFiltersActive: false,
  originalLanguage: 'all',
  withCast: '',
  withCrew: '',
  withNetworks: '',
  voteCount: 0,
  withKeywords: '',
  status: 'all',
  type: 'all',

  setRating: (rating) => set({ rating, isFiltersActive: true }),
  setGenre: (genre) => set({ genre, isFiltersActive: true }),
  setSortBy: (sortBy) => set({ sortBy }),
  setPopularity: (popularity) => set({ popularity, isFiltersActive: true }),
  setFirstAirDateRange: (start, end) => set({
    firstAirDateStart: start,
    firstAirDateEnd: end,
    isFiltersActive: true
  }),
  setOriginalLanguage: (originalLanguage) => set({ originalLanguage, isFiltersActive: true }),
  setWithCast: (withCast) => set({ withCast, isFiltersActive: true }),
  setWithCrew: (withCrew) => set({ withCrew, isFiltersActive: true }),
  setWithNetworks: (withNetworks) => set({ withNetworks, isFiltersActive: true }),
  setVoteCount: (voteCount) => set({ voteCount, isFiltersActive: true }),
  setWithKeywords: (withKeywords) => set({ withKeywords, isFiltersActive: true }),
  setStatus: (status) => set({ status, isFiltersActive: true }),
  setType: (type) => set({ type, isFiltersActive: true }),
  
  resetFilters: () => set({
    rating: 0,
    genre: 'all',
    sortBy: 'popularity-desc',
    popularity: 0,
    firstAirDateStart: '',
    firstAirDateEnd: '',
    isFiltersActive: false,
    originalLanguage: 'all',
    withCast: '',
    withCrew: '',
    withNetworks: '',
    voteCount: 0,
    withKeywords: '',
    status: 'all',
    type: 'all'
  })
}))