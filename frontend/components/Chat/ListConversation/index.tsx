import { api } from '@/config';

import { client } from '@/services';
import useConversation from '@/store/conversation';
import { useAuth } from '@/store/user';
import { getConversationUser } from '@/utils';
import {
  Box,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ConversationDoc,
  ServerToClientEvents
} from '../../../typing';
import ConversationItem from './ConversationItem';
import FindConversationModal from './FindConversationModal';

interface IListConversationProps {
  socket: React.RefObject<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >;
}

const ListConversation: React.FunctionComponent<IListConversationProps> = ({
  socket,
}) => {
  const conversations = useConversation((state) => state.conversations);
  const resetUnreadMessage = useConversation(
    (state) => state.resetUnreadMessage
  );
  const loggedInUser = useAuth((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentConversation = useConversation(
    (state) => state.currentConversation
  );
  const bg = useColorModeValue('blackAlpha.900', 'blackAlpha.300');

  // Mark as read all messages DB
  const { mutate: updateIsReadMessage } = useMutation({
    mutationFn: (data: { sender_id: string; conversation_id: string }) =>
      client.put(`${api.conversations}/${data.conversation_id}/messages`, data),
  });

  const onClickConversationItem = (conversation: ConversationDoc) => {
    console.log({ conversation });
    if (!socket.current || conversation.total_unread_message === 0) return;
    const sender_id = getConversationUser(conversation, loggedInUser)
      ?.id as string;
    const conversation_id: string = conversation.id;
    updateIsReadMessage({ sender_id, conversation_id });
    // emit mark as read message
    socket.current.emit('markAsRead', { sender_id, conversation_id });
    // update unReadMessage=0
    resetUnreadMessage(conversation_id);
  };

  return (
    <Box
      display={{ sm: currentConversation ? 'none' : 'block', md: 'block' }}
      width={{ sm: currentConversation ? '0' : '100%', md: '50%', lg: '400px' }}
      py={2}
      px={4}
      bg="whiteAlpha.50"
      position="relative"
    >
      <Stack height="full">
        <Box
          onClick={onOpen}
          bg={bg}
          cursor="pointer"
          p={2}
          borderRadius={4}
          flexShrink={0}
        >
          <Text textAlign="center" fontWeight={500} color="whiteAlpha.800">
            Find or start conversation
          </Text>
        </Box>
        <Stack flexGrow="1" overflowY="auto">
          {conversations &&
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onClickConversationItem(conversation)}
              >
                <ConversationItem
                  conversation={conversation}
                  isOnConversation={
                    currentConversation?.id === conversation.id ? true : false
                  }
                />
              </div>
            ))}
        </Stack>
      </Stack>
      <FindConversationModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default ListConversation;
