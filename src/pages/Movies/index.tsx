import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import MediaCard from "@/components/custom/MediaCard"
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import Filters from '@/components/custom/Filters'
import { useFilterStore } from '@/store/filter-store'
import { useFilteredContent } from '@/hooks/use-fiilteredContent'

interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  genre_ids: number[]
  vote_average: number
  release_date: string
  popularity: number
}

interface Genre {
  id: number
  name: string
}

const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const { isFiltersActive, resetFilters } = useFilterStore()
  
 
  const filteredMovies = useFilteredContent<Movie>(movies)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreResponse = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        )

        if (!genreResponse.ok) {
          throw new Error('Failed to fetch genres')
        }

        const genreData = await genreResponse.json()
        setGenres(genreData.genres)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching genres')
      }
    }

    const fetchMovies = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }

        const data = await response.json()
        
        if (page === 1) {
          setMovies(data.results)
        } else {
          // Remove duplicates when adding new movies
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

    fetchGenres()
    fetchMovies()
  }, [page])

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
    // If we want to refresh the data when filters are applied
    setPage(1)
    setMovies([])
  }

  // Debug logging
  console.log('Movies count:', movies.length)
  console.log('Filtered movies count:', filteredMovies.length)
  console.log('Filters active:', isFiltersActive)

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className='flex items-center justify-between'>
          <h1 className="text-2xl font-bold mb-8 text-gray-500">
            {isFiltersActive ? 'Filtered Movies' : 'All Movies'}
          </h1>
          <div className="flex items-center gap-4">
            {isFiltersActive && (
              <Button 
                variant="ghost" 
                onClick={() => {
                  resetFilters()
                  setPage(1)
                  setMovies([])
                }}
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
              <Filters onClose={handleFiltersClose} />
            </Sheet>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-center py-4">
            {error}
          </div>
        )}

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

        {filteredMovies.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            {isFiltersActive ? 'No movies match your filters' : 'No movies found'}
          </div>
        )}

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