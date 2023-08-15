import { ConversationDoc, User, UserLittle } from '@/typing';

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const getConversationUser = (
  conversation: ConversationDoc | null,
  loggedInUser: User | null
): UserLittle | undefined => {
  return conversation?.participants.filter(
    (participant) => participant.id !== loggedInUser?.id
  )[0];
};
