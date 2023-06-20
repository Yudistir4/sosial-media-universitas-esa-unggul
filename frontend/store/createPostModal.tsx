import { User } from '@/typing';
import { create } from 'zustand';

type ModalState = {
  isOpen: boolean;
  to_user: User | null | undefined;
  onOpen: (user?: User) => void;
  onClose: () => void;
};

export const useCreatePostModal = create<ModalState>((set) => ({
  isOpen: false,
  to_user: null,
  onOpen: (to_user?: User) => set({ isOpen: true, to_user }),
  onClose: () => set({ isOpen: false, to_user: null }),
}));
