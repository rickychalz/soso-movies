import useAuthStore from "../store/auth-context";

const API_URL = "http://localhost:8000/api/media";

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

export const watchlistService = {
  
  async addToWatchlist(movieData: { movieId: string; movieTitle: string; posterPath: string }) {
    const token = useAuthStore.getState().user?.token;
    if (!token) {
      return Promise.reject("No token available");
    }

    return client("/add-to-watchlist", {
      method: "POST",
      body: movieData,
      token,
    });
  },

  
  async removeFromWatchlist(movieId: string) {
    const token = useAuthStore.getState().user?.token;
    if (!token) {
      return Promise.reject("No token available");
    }

    return client(`/remove-from-watchlist/${movieId}`, {
      method: "DELETE",
      token,
    });
  },

  
  async getWatchlist(page: number = 1, limit: number = 10) {
    const token = useAuthStore.getState().user?.token;
    if (!token) {
      return Promise.reject("No token available");
    }

    return client(`/get-watchlist?page=${page}&limit=${limit}`, { token });
  },

  
  async isMovieInWatchlist(movieId: string) {
    const token = useAuthStore.getState().user?.token;
    if (!token) {
      return Promise.reject("No token available");
    }

    return client(`/watchlist/${movieId}`, { token });
  },
};
