import { api } from '@/config';
import { client } from '@/services';
import {
  AsReadPayload,
  ConversationDoc,
  MessageDoc,
  MessageSocket,
} from '@/typing';
import { create } from 'zustand';
import { useAuth } from './user';
import { formatDate } from '@/utils';

interface MessagesList {
  [key: string]: (MessageDoc | string)[];
}
interface Messages {
  date: string;
  messages: MessageDoc[];
}

interface ConversationState {
  isLoading: boolean;
  messageList: MessagesList;
  conversations: ConversationDoc[];
  currentConversation: ConversationDoc | null;
  isCurrentConversationUserOnline: boolean;
  resetAllState: () => void;
  getMessages: (conversation_id: string) => Promise<(MessageDoc | string)[]>;
  fetchMessages: (conversation_id: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
  updateLastMessageInConversations: (message: MessageDoc) => void;
  onReceiveAsReadStatus: (payload: AsReadPayload) => void;
  resetUnreadMessage: (conversation_id: string) => void;
  receiveNewMessage: (message: MessageSocket) => void;
  setConversations: (conversations: ConversationDoc[]) => void;
  setCurrentConversation: (user: ConversationDoc | null) => void;
  setCurrentConversationAsync: (user: ConversationDoc) => Promise<void>;
  setIsCurrentConversationUserOnline: (status: boolean) => void;
}

const useConversation = create<ConversationState>((set, get) => ({
  conversations: [],
  isLoading: false,
  messageList: {},
  resetAllState() {
    set({
      conversations: [],
      messageList: {},
      currentConversation: null,
    });
  },
  getMessages: async (
    conversation_id: string
  ): Promise<(MessageDoc | string)[]> => {
    console.log('get messages');
    let messages = get().messageList[conversation_id];
    if (messages) {
      return messages;
    } else {
      console.log('fetching message');
      await get().fetchMessages(conversation_id);
      return get().messageList[conversation_id];
    }
  },
  onReceiveAsReadStatus({ conversation_id }) {
    console.log('onReceiveAsReadStatus');
    set((state) => ({
      messageList: {
        ...state.messageList,
        [conversation_id]: state.messageList[conversation_id].map((message) => {
          if (typeof message === 'string') {
            return message;
          } else {
            return { ...message, is_read: true };
          }
        }),
      },
    }));
  },
  updateLastMessageInConversations(message) {
    console.log('updateLastMessageInConversations');

    const conversations = [...get().conversations];
    const currentConversation = get().currentConversation;
    if (!currentConversation) return;

    const conversationIndex: number = conversations.findIndex(
      (conversation: any) => conversation.id === currentConversation.id
    );
    const updateLastMessage = (old: any, last_message: any): any => {
      console.log('updateLastMessage');

      let conversations = JSON.parse(JSON.stringify(old));
      const itemToMove = conversations[conversationIndex];
      conversations.splice(conversationIndex, 1);
      conversations.unshift({ ...itemToMove, last_message });
      return conversations;
    };

    if (conversationIndex >= 0) {
      set({ conversations: updateLastMessage(conversations, message) });
    } else {
      set({
        conversations: [
          { ...currentConversation, last_message: message },
          ...conversations,
        ],
      });
    }

    set((state) => ({
      messageList: {
        ...state.messageList,
        [message.conversation_id]: [
          ...state.messageList[message.conversation_id],
          message,
        ],
      },
    }));
  },
  resetUnreadMessage(conversation_id) {
    console.log('resetUnreadMessage');

    const conversations = [...get().conversations];

    const conversationIndex: number = conversations.findIndex(
      (conversation: any) => conversation.id === conversation_id
    );
    conversations[conversationIndex].total_unread_message = 0;
    set({ conversations });
  },
  receiveNewMessage: (message: MessageSocket) => {
    console.log('receiveNewMessage');

    const conversations = get().conversations;
    const currentConversation = get().currentConversation;

    const messageDoc: MessageDoc = {
      conversation_id: message.conversation_id,
      id: message.id,
      text: message.text,
      created_at: message.created_at,
      updated_at: message.created_at,
      sender_id: message.sender_id,
      is_read: false,
    };

    const conversationIndex: number = conversations.findIndex(
      (conversation: any) => conversation.id === message.conversation_id
    );

    if (conversationIndex >= 0) {
      let newConversations = JSON.parse(
        JSON.stringify(conversations)
      ) as ConversationDoc[];
      const itemToMove = newConversations[conversationIndex];
      if (currentConversation?.id !== itemToMove.id) {
        itemToMove.total_unread_message++;
      }
      newConversations.splice(conversationIndex, 1);
      newConversations.unshift({ ...itemToMove, last_message: messageDoc });
      set({ conversations: newConversations });
    } else if (message.sender) {
      let newConversations = JSON.parse(JSON.stringify(conversations));
      const newConversation: ConversationDoc = {
        id: message.conversation_id,
        last_message: messageDoc,
        total_unread_message: 1,
        created_at: message.created_at,
        updated_at: message.created_at,
        participants: [message.sender],
      };
      set({ conversations: [newConversation, ...newConversations] });
      // get().fetchConversations();
    }

    // update messageList

    // handle if messageList not exist
    if (!get().messageList[message.conversation_id]) {
      set((state) => ({
        messageList: {
          ...state.messageList,
          [message.conversation_id]: [messageDoc],
        },
      }));
    } else {
      set((state) => ({
        messageList: {
          ...state.messageList,
          [message.conversation_id]: [
            ...state.messageList[message.conversation_id],
            messageDoc,
          ],
        },
      }));
    }
  },
  fetchMessages: async (conversation_id) => {
    console.log('fetchMessages');
    try {
      const response = await client.get<{ data: MessageDoc[] }>(
        `${api.conversations}/${conversation_id}/messages`
      );

      const messages = response.data.data.reduce(
        (accumulator: Messages[], current) => {
          const currentDate = formatDate(current.created_at);
          const lastDate =
            accumulator.length > 0
              ? accumulator[accumulator.length - 1].date
              : null;
          if (currentDate === lastDate) {
            accumulator[accumulator.length - 1].messages.push(current);
          } else {
            accumulator.push({ date: currentDate, messages: [current] });
          }
          return accumulator;
        },
        []
      );

      const allMessages: (string | MessageDoc)[] = [];
      messages?.forEach((item) => {
        allMessages.push(item.date);
        item.messages.forEach((message) => allMessages.push(message));
      });

      set((state) => ({
        messageList: {
          ...state.messageList,
          [conversation_id]: allMessages,
        },
      }));
    } catch (error) {
      console.error('Error fetching messsages:', error);
    }
  },
  fetchConversations: async () => {
    console.log('fetchConversations');

    try {
      set({ isLoading: true });
      const response = await client.get<{ data: ConversationDoc[] }>(
        api.conversations
      );

      const conversations = response.data.data.map((conversation) => {
        return {
          ...conversation,
          participants: conversation.participants.filter(
            (user) => user.id !== useAuth.getState().user?.id
          ),
        };
      });

      for (const conversation of conversations) {
        await get().fetchMessages(conversation.id);
      }

      set({ conversations, isLoading: false });
    } catch (error) {
      console.error('Error fetching data:', error);
      set({ isLoading: false });
    }
  },

  setConversations: (conversations: ConversationDoc[]) =>
    set({ conversations }),

  isCurrentConversationUserOnline: false,
  currentConversation: null,
  setIsCurrentConversationUserOnline: (status: boolean) =>
    set({ isCurrentConversationUserOnline: status }),
  setCurrentConversationAsync: async (conversation: ConversationDoc) => {
    console.log('setCurrentConversationAsync');

    if (!get().messageList[conversation.id]) {
      await get().fetchMessages(conversation.id);
    }
    set({
      currentConversation: {
        ...conversation,
        participants: conversation.participants.filter(
          (user) => user.id !== useAuth.getState().user?.id
        ),
      },
    });
  },
  setCurrentConversation: (user: ConversationDoc | null) =>
    set({ currentConversation: user }),
}));

export default useConversation;
