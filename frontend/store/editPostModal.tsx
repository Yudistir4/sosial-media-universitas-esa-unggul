import { PostDoc } from '@/typing';
import { create } from 'zustand';

type ModalState = {
  isOpen: boolean;
  post: PostDoc | null;
  onOpen: (post: PostDoc) => void;
  onClose: () => void;
};

export const useEditPostModal = create<ModalState>((set) => ({
  isOpen: false,
  post: null,
  onOpen: (post: PostDoc) => set({ isOpen: true, post }),
  onClose: () => set({ isOpen: false, post: null }),
}));
