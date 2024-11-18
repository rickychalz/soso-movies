import useAuthStore from '@/store/auth-context';
import { useState, ChangeEvent, FormEvent } from 'react';

interface ProfileData {
  username: string;
  email: string;
  avatar: File | null;
}

export interface AuthResponse {
  success: boolean;
  _id: string;
  username: string;
  email: string;
  avatar: string;
  token: string;
}

interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

const Index = () => {
  const {user} =useAuthStore()

  const [profileData, setProfileData] = useState<ProfileData>({
    username: user?.username || '',
    email: user?.email || '',
    avatar: null,
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    oldPassword: '',
    newPassword: '',
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Handle profile input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file change for avatar
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData((prevData) => ({
        ...prevData,
        avatar: e.target.files[0],
      }));
    }
  };

  // Handle password change input change
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
  
    const formData = new FormData();
    formData.append('username', profileData.username);
    formData.append('email', profileData.email);
    if (profileData.avatar) {
      formData.append('avatar', profileData.avatar);
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/users/update-profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.token}`, // Assuming token is stored in localStorage
        },
        body: formData,
      });
  
      const result = await response.json();

      console.log(result); 
  
      if (response.ok) {
        // Assuming the response contains updated user data
        const updatedUser: AuthResponse = result;
  
        // Update the auth store with the updated user information
        useAuthStore.getState().login({
          success: true,
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          token: updatedUser.token,
        });
  
        alert('Profile updated successfully');
        console.log(result);
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChangingPassword(true);

    const { oldPassword, newPassword } = passwordData;

    try {
      const response = await fetch('http://localhost:8000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Password changed successfully');
        console.log(result);
      } else {
        alert(result.message || 'Failed to change password');
      }
    } catch (error) {
      alert('Error changing password');
      console.error(error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle delete user action
  const handleDeleteUser = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      setIsDeleting(true);

      try {
        const response = await fetch('http://localhost:8000/api/users/delete-user', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        const result = await response.json();
        if (response.ok) {
          alert('Your account has been deleted');
          console.log(result);
          // Optionally redirect the user to the login page after deletion
          window.location.href = '/login'; 
        } else {
          alert(result.message || 'Failed to delete account');
        }
      } catch (error) {
        alert('Error deleting account');
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }
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

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg mt-6"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Save Changes'}
        </button>
      </form>

      {/* Change Password Section */}
      <div className="mt-12">
        <div className="text-2xl font-semibold mb-6">Change Password</div>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="oldPassword">
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
            <label className="block text-sm font-medium mb-2" htmlFor="newPassword">
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
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Delete User Section */}
      <div className="mt-12">
        <button
          onClick={handleDeleteUser}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg mt-6"
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
};

export default Index;
