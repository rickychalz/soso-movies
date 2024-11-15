// src/types/auth.ts
export interface AuthResponse {
  success: boolean;
  _id: string;
  username: string;
  email: string;
  avatar: string;
  token: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  token: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  redirectAfterLogin: string | null;
  login: (userData: AuthResponse) => void;
  logout: () => void;
  setRedirectPath: (path: string | null) => void;
}

// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      redirectAfterLogin: null,
      login: (userData: AuthResponse) => set({
        isLoggedIn: true,
        user: {
          id: userData._id,
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
          token: userData.token,
        }
      }),
      logout: () => set({
        isLoggedIn: false,
        user: null,
        redirectAfterLogin: null
      }),
      setRedirectPath: (path) => set({ redirectAfterLogin: path }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;