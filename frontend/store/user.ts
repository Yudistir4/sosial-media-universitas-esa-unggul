import { LoginData, User } from '@/typing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  access_token: string | null;
  refresh_token: string | null;
  user: User | null;
  setUser: (user: User) => void;
  setEmail: (email: string) => void;
  setProfilePic: (profile_pic_url: string) => void;
  login: (data: LoginData) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      access_token: null,
      refresh_token: null,
      user: null,
      setUser: (user: User) => set({ user }),
      setEmail: (email: string) => {
        const user = get().user;
        user && set({ user: { ...user, email } });
      },
      setProfilePic: (profile_pic_url: string) => {
        const user = get().user;
        user && set({ user: { ...user, profile_pic_url } });
      },
      login: (data: LoginData) => set({ ...data }),
      logout: () =>
        set({ user: null, access_token: null, refresh_token: null }),
    }),
    { name: 'user-storage' }
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
