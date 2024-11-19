import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import useAuthStore from "@/store/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ProfileData {
  username: string;
  email: string;
  avatar: File | null;
  favoriteGenres: string[];
}

interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

interface Genre {
  id: number;
  name: string;
}

const ProfilePage = () => {
  const { user } = useAuthStore();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  const [genreError, setGenreError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { logout } = useAuthStore();

  const [profileData, setProfileData] = useState<ProfileData>({
    username: user?.username || "",
    email: user?.email || "",
    avatar: null,
    favoriteGenres: user?.favoriteGenres || [],
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    oldPassword: "",
    newPassword: "",
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const API_KEY = "131625b72ced7cabd70cf8ba3c7fc79e";

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoadingGenres(true);
      setGenreError(null);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch genres");
        }
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setGenreError("Failed to load genres. Please try again later.");
      } finally {
        setIsLoadingGenres(false);
      }
    };
    fetchGenres();
  }, [showGenreModal]);

  const handleGenreModalOpen = () => {
    setShowGenreModal(true);
  };

  const handleGenreSave = async (selectedGenres) => {
    try {
      const genresWithDetails = selectedGenres.map((genreName) => {
        const genre = genres.find((g) => g.name === genreName);
        return { id: genre.id, name: genre.name };
      });

      const response = await fetch(
        "http://localhost:8000/api/users/add-favorite-genres",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ genres: genresWithDetails }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setProfileData((prev) => ({
          ...prev,
          favoriteGenres: result.favoriteGenres.map((genre) => genre.name),
        }));
        setShowGenreModal(false);
      } else {
        throw new Error("Failed to save genres");
      }
    } catch (error) {
      console.error("Error saving genres:", error);
      alert("Failed to save genres");
    }
  };

  const handleDeleteGenre = async (genreToDelete) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/users/delete-favorite-genre",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ genreId: genreToDelete.id }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setProfileData((prev) => ({
          ...prev,
          favoriteGenres: result.favoriteGenres.map((genre) => genre.name),
        }));
      } else {
        const errorResult = await response.json();
        throw new Error(errorResult.message || "Failed to delete genre");
      }
    } catch (error) {
      console.error("Error deleting genre:", error);
      alert(error.message);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData((prev) => ({
        ...prev,
        avatar: e.target.files[0],
      }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("username", profileData.username);
    formData.append("email", profileData.email);
    if (profileData.avatar) {
      formData.append("avatar", profileData.avatar);
    }
    formData.append(
      "favoriteGenres",
      JSON.stringify(profileData.favoriteGenres)
    );

    try {
      const response = await fetch(
        "http://localhost:8000/api/users/update-profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        useAuthStore.getState().login({
          ...result,
          favoriteGenres: profileData.favoriteGenres,
        });
        alert("Profile updated successfully");
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (error) {
      alert("Error updating profile");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChangingPassword(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(passwordData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Password changed successfully");
        setPasswordData({ oldPassword: "", newPassword: "" });
      } else {
        alert(result.message || "Failed to change password");
      }
    } catch (error) {
      alert("Error changing password");
      console.error(error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      setIsDeleting(true);
      try {
        const response = await fetch(
          "http://localhost:8000/api/users/delete-user",
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (response.ok) {
          localStorage.clear();
          alert("Your account has been deleted");
          logout();
          navigate("/");
        } else {
          const result = await response.json();
          alert(result.message || "Failed to delete account");
        }
      } catch (error) {
        alert("Error deleting account");
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  return (
    <div className="mx-auto flex flex-col w-full text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-2xl font-semibold mb-6">Update Profile</div>

      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={profileData.username}
            onChange={handleInputChange}
            className="w-full p-3 bg-[#212121] text-white rounded-lg focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleInputChange}
            className="w-full p-3 bg-[#212121] text-white rounded-lg focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="avatar">
            Profile Picture
          </label>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 bg-[#212121] text-white rounded-lg focus:outline-none"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium">Favorite Genres</label>
          <div className="flex flex-col items-start lg:flex-row lg:justify-between lg:items-center">
            <div className="flex flex-wrap gap-2 mb-3">
              {profileData.favoriteGenres.map((genre, index) => {
                
                const genreName =
                  typeof genre === "string" ? genre : genre.name;

             
                const fullGenre = genres.find((g) => g.name === genreName);

                return (
                  <div
                    key={index}
                    className="px-3 py-1 rounded-full text-sm flex items-center gap-2 my-3 bg-teal-600/20 text-teal-400 hover:bg-teal-600/30"
                  >
                    {genreName}
                    <div
                      onClick={() =>
                        handleDeleteGenre({
                          id: fullGenre?.id ?? null,
                          name: genreName,
                        })
                      }
                    >
                      <X size={18} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleGenreModalOpen}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Edit Genres
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg mt-6"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Save Changes"}
        </button>
      </form>

      {/* Change Password Section */}
      <div className="mt-12">
        <div className="text-2xl font-semibold mb-6">Change Password</div>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="oldPassword"
            >
              Old Password
            </label>
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-[#212121] text-white rounded-lg focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-[#212121] text-white rounded-lg focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg mt-6"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* Delete User Section */}
      <div className="mt-12">
        <button
          onClick={handleOpenModal}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg mt-6"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>

      {/* Genre Selection Modal */}
      {showGenreModal && (
        <Dialog open={showGenreModal} onOpenChange={setShowGenreModal}>
          <DialogContent className="bg-[#212121] border-none text-white">
            <DialogTitle>Select your favorite genres</DialogTitle>
            <DialogDescription>
              Please select the genres you are interested in.
            </DialogDescription>
            {isLoadingGenres && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
              </div>
            )}
            {genreError && (
              <div className="text-red-500 text-center py-4">{genreError}</div>
            )}
            {!isLoadingGenres && !genreError && (
              <div className="flex flex-col h-[300px] flex-wrap">
                {genres.map((genre) => (
                  <div
                    key={genre.id}
                    className="flex items-center my-2 space-x-2"
                  >
                    <Checkbox
                      checked={profileData.favoriteGenres.includes(genre.name)}
                      onCheckedChange={(checked) => {
                        setProfileData((prev) => ({
                          ...prev,
                          favoriteGenres: checked
                            ? [...prev.favoriteGenres, genre.name]
                            : prev.favoriteGenres.filter(
                                (g) => g !== genre.name
                              ),
                        }));
                      }}
                      className="border-gray-400"
                      id={String(genre.id)}
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
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleGenreSave(profileData.favoriteGenres)}
                className="bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                disabled={isLoadingGenres}
              >
                Save
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent className="bg-[#212121] border-none text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-teal-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;
