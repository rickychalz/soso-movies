import useAuthStore from "../store/auth-context";

const API_URL = "http://localhost:8000/api/users";

// Updated interface to be more specific about body types
interface FetchOptions extends Omit<RequestInit, "body"> {
  token?: string;
  body?: Record<string, any> | FormData;
}

async function client(
  endpoint: string,
  { token, body, ...customConfig }: FetchOptions = {}
) {
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Only set Content-Type for JSON bodies, let browser set it for FormData
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  // Handle body based on type
  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(data.message || "An error occurred");
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("An error occurred");
  }
}

// Define specific types for different request bodies
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface ProfileUpdateData {
  username?: string;
  email?: string;
  avatar?: File; // Changed from string to File for avatar
}

interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    return client("/login", { body: credentials });
  },

  async register(userData: RegisterData) {
    return client("/register", { body: userData });
  },

  async logout() {
    const token = useAuthStore.getState().user?.token;

    if (!token) {
      return Promise.reject("No token available");
    }

    try {
      const response = await client("/logout", {
        method: "POST",
        token, 
      });

      
      if (response.success) {
        useAuthStore.getState().logout(); 
        return response; 
      }

      throw new Error("Failed to log out");
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred during logout"
      );
    }
  },

  async updateProfile(userData: ProfileUpdateData) {
    const token = useAuthStore.getState().user?.token;

    // If there's an avatar, use FormData
    if (userData.avatar) {
      const formData = new FormData();
      if (userData.username) formData.append("username", userData.username);
      if (userData.email) formData.append("email", userData.email);
      formData.append("avatar", userData.avatar);

      return client("/", {
        method: "PUT",
        body: formData,
        token,
      });
    }

    // Otherwise, use JSON
    return client("/", {
      method: "PUT",
      body: userData,
      token,
    });
  },

  async changePassword(passwords: PasswordChangeData) {
    const token = useAuthStore.getState().user?.token;
    return client("/password", {
      method: "PUT",
      body: passwords,
      token,
    });
  },

  async deleteAccount() {
    const token = useAuthStore.getState().user?.token;
    return client("/", {
      method: "DELETE",
      token,
    });
  },
};

export const userService = {
  async getFavoriteGenres() {
    const token = useAuthStore.getState().user?.token;
    return client("/genres", { token });
  },

  async updateFavoriteGenres(genres: string[]) {
    const token = useAuthStore.getState().user?.token;
    return client("/genres", {
      method: "PUT",
      body: { genres },
      token,
    });
  },

  async getLikedMovies() {
    const token = useAuthStore.getState().user?.token;
    return client("/movies/liked", { token });
  },
};
