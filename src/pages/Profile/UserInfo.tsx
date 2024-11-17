import useAuthStore from "@/store/auth-context";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Adjust path if needed

const UserInfo = () => {
  const { user, isLoggedIn } = useAuthStore(); // Accessing user and login state from the store
  const [image, setImage] = useState<string | null>(null);

  // Set the avatar as the image if available
  useEffect(() => {
    if (user?.avatar) {
      setImage(user.avatar);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string); // Cast the result as string
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => setImage(null); // Remove the image

  if (!isLoggedIn) {
    return <div>Please log in to view your profile.</div>; // Fallback if user is not logged in
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center w-full gap-4">
          <div>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <label
                  htmlFor="imageUpload"
                  className="absolute w-full h-full cursor-pointer rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center"
                >
                  {image ? (
                    <>
                      <img
                        src={image}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="absolute top-0 right-0 bg-gray-800 text-white rounded-full p-1 text-xs"
                      >
                        X
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500">Upload</span>
                  )}
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xl">{user?.username}</div>
            <div className="text-lg font-light">{user?.email}</div>
          </div>
        </div>
        <Link to="/update-profile">
          <button
            className="bg-teal-600 px-4 py-2 rounded-lg text-white"
          >
            Edit
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserInfo;
