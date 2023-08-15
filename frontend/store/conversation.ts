import { ConversationDoc } from '@/typing';
import { create } from 'zustand';

interface ConversationState {
  isNewConversation: boolean;

  currentConversation: ConversationDoc | null;
  setCurrentConversation: (user: ConversationDoc | null) => void;
  isCurrentConversationUserOnline: boolean;
  setIsCurrentConversationUserOnline: (status: boolean) => void;
  setIsNewConversation: (status: boolean) => void;
}

const useConversation = create<ConversationState>((set) => ({
  isNewConversation: false,
  isCurrentConversationUserOnline: false,
  currentConversation: null,
  setIsCurrentConversationUserOnline: (status: boolean) =>
    set({ isCurrentConversationUserOnline: status }),
  setIsNewConversation: (status: boolean) => set({ isNewConversation: status }),
  setCurrentConversation: (user: ConversationDoc | null) =>
    set({ currentConversation: user }),
}));

export default useConversation;
