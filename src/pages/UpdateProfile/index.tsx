import React, { useState } from 'react';

const Index = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    password: '',
    favoriteGenres: [],
    profilePicture: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfileData((prevData) => ({
      ...prevData,
      profilePicture: e.target.files[0],
    }));
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setProfileData((prevData) => {
      const newGenres = checked
        ? [...prevData.favoriteGenres, value]
        : prevData.favoriteGenres.filter((genre) => genre !== value);
      return {
        ...prevData,
        favoriteGenres: newGenres,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., API call)
    console.log(profileData);
  };

  return (
    <div className="mx-auto flex flex-col w-full text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="text-2xl font-semibold mb-6">
        Update Profile
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none"
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
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={profileData.password}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Favorite Genres</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="checkbox"
                value="Action"
                checked={profileData.favoriteGenres.includes('Action')}
                onChange={handleGenreChange}
                className="mr-2"
              />
              Action
            </label>
            <label>
              <input
                type="checkbox"
                value="Comedy"
                checked={profileData.favoriteGenres.includes('Comedy')}
                onChange={handleGenreChange}
                className="mr-2"
              />
              Comedy
            </label>
            <label>
              <input
                type="checkbox"
                value="Drama"
                checked={profileData.favoriteGenres.includes('Drama')}
                onChange={handleGenreChange}
                className="mr-2"
              />
              Drama
            </label>
            <label>
              <input
                type="checkbox"
                value="Horror"
                checked={profileData.favoriteGenres.includes('Horror')}
                onChange={handleGenreChange}
                className="mr-2"
              />
              Horror
            </label>
            <label>
              <input
                type="checkbox"
                value="Sci-Fi"
                checked={profileData.favoriteGenres.includes('Sci-Fi')}
                onChange={handleGenreChange}
                className="mr-2"
              />
              Sci-Fi
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="profilePicture">
            Profile Picture
          </label>
          <input
            id="profilePicture"
            name="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-6"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Index;
