import { create } from "zustand"

interface FilterState {
  mediaType: string;
  rating: number;
  genre: string;
  year: string;
  setMediaType: (mediaType: string) => void;
  setRating: (rating: number) => void;
  setGenre: (genre: string) => void;
  setYear: (year: string) => void;
  resetFilters: () => void;  // Added reset function
}

export const useFilterStore = create<FilterState>((set) => ({
  mediaType: "all",
  rating: 0,
  genre: "all",
  year: "all",
  setMediaType: (mediaType) => set({ mediaType }),
  setRating: (rating) => set({ rating }),
  setGenre: (genre) => set({ genre }),
  setYear: (year) => set({ year }),
  resetFilters: () => set({ mediaType: "all", rating: 0, genre: "all", year: "all" })
}));