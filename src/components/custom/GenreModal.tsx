import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import useAuthStore from "@/store/auth-context";

interface Genre {
  id: number;
  name: string;
}

interface GenreModalProps {
  onSave: (genres: string[]) => void;
}

const GenreModal: React.FC<GenreModalProps> = ({ onSave }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const { control, handleSubmit } = useForm();
  const { user } = useAuthStore();
  const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const onSubmit = async (data: Record<string, boolean>) => {
    const selectedGenres = Object.entries(data)
      .filter(([_, isChecked]) => isChecked)
      .map(([genreId]) => {
        const genre = genres.find(g => g.id.toString() === genreId);
        return genre?.name;
      })
      .filter((name): name is string => name !== undefined);

    try {
      const response = await fetch("http://localhost:8000/api/users/add-favorite-genres", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ genres: selectedGenres }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save genres');
      }

      const result = await response.json();
      onSave(result.favoriteGenres);
    } catch (error) {
      console.error("Error saving genres:", error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="bg-[#212121] border-none text-white">
        <DialogTitle>Select your favorite genres</DialogTitle>
        <DialogDescription>
          Please select the genres you are interested in.
        </DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col h-[300px] flex-wrap">
            {genres.map((genre) => (
              <div key={genre.id} className="flex items-center my-2 space-x-2">
                <Controller
                  name={String(genre.id)}
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-400"
                      id={String(genre.id)}
                    />
                  )}
                />
                <label
                  htmlFor={String(genre.id)}
                  className="text-white cursor-pointer"
                >
                  {genre.name}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default GenreModal;