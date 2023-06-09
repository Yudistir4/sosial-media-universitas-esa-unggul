import { LoginData, User } from '@/typing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type AuthState = {
  access_token: string | null;
  refresh_token: string | null;
  user: User | null;
  login: (data: LoginData) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      access_token: null,
      refresh_token: null,
      user: null,
      login: (data: LoginData) => set({ ...data }),
      logout: () =>
        set({ user: null, access_token: null, refresh_token: null }),
    }),
    { name: 'user-storage', getStorage: () => localStorage }
  )
);

export const setAccessToken = (token: string | null) => {
  useAuth.setState({ access_token: token });
};

export const logout = () => {
  useAuth.getState().logout();
};

export const getAccessToken = () => {
  return useAuth.getState().access_token;
};
export const getRefreshToken = () => {
  return useAuth.getState().refresh_token;
};
