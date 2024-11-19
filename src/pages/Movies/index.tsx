import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import MediaCard from "@/components/custom/MediaCard"
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import MovieFilters from '../../components/custom/MovieFilter'
import { useMovieFilterStore } from '@/store/movie-filter-store'
import { useFilteredMovies } from '../../hooks/useMovieFilteredContent'

// Types
interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  genre_ids: number[]
  vote_average: number
  release_date: string
  popularity: number
  original_language: string
  adult: boolean
  vote_count: number
  production_companies?: { id: number; name: string }[]
}

interface Genre {
  id: number
  name: string
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e"; 

const Movies = () => {
  // State
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // Get filter state from store
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
    withKeywords,
    resetFilters
  } = useMovieFilterStore()

  // Get filtered movies
  const filteredMovies = useFilteredMovies(movies)

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch genres')
        }

        const data = await response.json()
        setGenres(data.genres)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching genres')
      }
    }

    fetchGenres()
  }, [])

  // Fetch movies when filters or page changes
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      setError(null)

      try {
        // Build query parameters
        const params = new URLSearchParams({
          api_key: API_KEY,
          language: 'en-US',
          page: page.toString(),
          include_adult: includeAdult.toString(),
        })

        // Add sort parameter
        switch (sortBy) {
          case 'popularity-desc':
            params.append('sort_by', 'popularity.desc')
            break
          case 'popularity-asc':
            params.append('sort_by', 'popularity.asc')
            break
          case 'rating-desc':
            params.append('sort_by', 'vote_average.desc')
            break
          case 'rating-asc':
            params.append('sort_by', 'vote_average.asc')
            break
          case 'date-desc':
            params.append('sort_by', 'release_date.desc')
            break
          case 'date-asc':
            params.append('sort_by', 'release_date.asc')
            break
          case 'title-asc':
            params.append('sort_by', 'original_title.asc')
            break
          case 'title-desc':
            params.append('sort_by', 'original_title.desc')
            break
          default:
            params.append('sort_by', 'popularity.desc')
        }

        // Add filter parameters
        if (genre !== 'all') {
          params.append('with_genres', genre)
        }
        if (originalLanguage !== 'all') {
          params.append('with_original_language', originalLanguage)
        }
        if (voteCount > 0) {
          params.append('vote_count.gte', voteCount.toString())
        }
        if (rating > 0) {
          params.append('vote_average.gte', rating.toString())
        }
        if (popularity > 0) {
          params.append('with_popularity.gte', popularity.toString())
        }
        if (releaseDateStart) {
          params.append('primary_release_date.gte', releaseDateStart)
        }
        if (releaseDateEnd) {
          params.append('primary_release_date.lte', releaseDateEnd)
        }
        if (withKeywords) {
          params.append('with_keywords', withKeywords)
        }
        if (withCast) {
          params.append('with_cast', withCast)
        }
        if (withCrew) {
          params.append('with_crew', withCrew)
        }
        if (withCompanies) {
          params.append('with_companies', withCompanies)
        }

        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }

        const data = await response.json()
        
        if (page === 1) {
          setMovies(data.results)
        } else {
       
          const newMovies = data.results
          setMovies(prev => {
            const existingIds = new Set(prev.map(movie => movie.id))
            const uniqueNewMovies = newMovies.filter(movie => !existingIds.has(movie.id))
            return [...prev, ...uniqueNewMovies]
          })
        }

        setHasMore(data.page < data.total_pages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching movies')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [
    page,
    sortBy,
    genre,
    originalLanguage,
    includeAdult,
    rating,
    voteCount,
    popularity,
    releaseDateStart,
    releaseDateEnd,
    withKeywords,
    withCast,
    withCrew,
    withCompanies
  ])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
    setMovies([])
  }, [isFiltersActive])

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const getGenres = (genreIds: number[]) => {
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id)
        return genre ? genre.name : 'Unknown'
      })
      .join(', ')
  }

  const handleFiltersClose = () => {
    setPage(1)
    setMovies([])
  }

  const handleResetFilters = () => {
    resetFilters()
    setPage(1)
    setMovies([])
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <h1 className="text-2xl font-bold text-gray-500">
            {isFiltersActive ? 'Filtered Movies' : 'All Movies'}
          </h1>
          
          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            {isFiltersActive && (
              <Button 
                variant="ghost" 
                onClick={handleResetFilters}
                className="text-white hover:text-red-500"
              >
                Reset Filters
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Filters
                </Button>
              </SheetTrigger>
              <MovieFilters onClose={handleFiltersClose} />
            </Sheet>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        )}

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMovies.map((movie) => (
            <MediaCard
              key={`${movie.id}-${movie.title}`}
              id={movie.id}
              title={movie.title}
              overview={movie.overview}
              posterPath={movie.poster_path}
              genreIds={movie.genre_ids}
              mediaType="movie"
              getGenres={getGenres}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredMovies.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            {isFiltersActive ? 'No movies match your filters' : 'No movies found'}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !isFiltersActive && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMore}
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Movies