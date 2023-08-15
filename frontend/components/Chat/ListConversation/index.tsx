import { api } from '@/config';

import useConversation from '@/store/conversation';
import { getConversationUser } from '@/utils';
import {
  Box,
  Button,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ConversationDoc,
  MessageSocket,
  ServerToClientEvents,
} from '../../../typing';
import ConversationItem from './ConversationItem';
import FindConversationModal from './FindConversationModal';
import { useAuth } from '@/store/user';
import { client } from '@/services';

interface IListConversationProps {
  socket: React.RefObject<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >;
}

const ListConversation: React.FunctionComponent<IListConversationProps> = ({
  socket,
}) => {
  const queryClient = useQueryClient();

  const loggedInUser = useAuth((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentConversation = useConversation(
    (state) => state.currentConversation
  );
  const bg = useColorModeValue('blackAlpha.900', 'blackAlpha.300');

  // Get Conversation list
  const { data: dataConversations, refetch: refetchConversations } = useQuery({
    queryKey: ['conversations'],
    refetchOnWindowFocus: false,
    queryFn: () => client.get<{ data: ConversationDoc[] }>(api.conversations),
    select(res) {
      return res.data.data.map((conversation) => {
        return {
          ...conversation,
          participants: conversation.participants.filter(
            (user) => user.id !== loggedInUser?.id
          ),
        };
      }) as ConversationDoc[];
    },
  });

  // Mark as read all messages DB
  const { mutate: updateIsReadMessage } = useMutation({
    mutationFn: (data: { sender_id: string; conversation_id: string }) =>
      client.put(`${api.conversations}/${data.conversation_id}/messages`, data),
  });

  React.useEffect(() => {
    function onReceive(message: MessageSocket) {
      console.log({ messageBg: message });
      queryClient.setQueryData(['conversations'], (old: any) => {
        const conversationIndex: number = old.data.data.findIndex(
          (conversation: any) => conversation.id === message.conversation_id
        );

        if (conversationIndex >= 0) {
          let conversations = JSON.parse(JSON.stringify(old.data.data));
          const itemToMove = conversations[conversationIndex];
          if (currentConversation?.id !== itemToMove.id) {
            itemToMove.total_unread_message++;
          }
          conversations.splice(conversationIndex, 1);
          conversations.unshift({ ...itemToMove, last_message: message });
          return { data: { data: conversations } };
        } else {
          refetchConversations();
        }
      });
    }
    const mySocket = socket.current;
    mySocket?.on('receiveMessage', onReceive);
    return () => {
      mySocket?.off('receiveMessage', onReceive);
    };
  }, [socket, currentConversation, queryClient, refetchConversations]);

  const onClickConversationItem = (conversation: ConversationDoc) => {
    if (!socket.current || conversation.total_unread_message === 0) return;
    const sender_id = getConversationUser(conversation, loggedInUser)
      ?.id as string;
    const conversation_id: string = conversation.id;
    updateIsReadMessage({ sender_id, conversation_id });
    console.log('MarkSread');
    // emit mark as read message
    socket.current.emit('markAsRead', { sender_id, conversation_id });

    // update unReadMessage=0
    queryClient.setQueryData(['conversations'], (old: any) => {
      const conversationIndex: number = old.data.data.findIndex(
        (conversation: any) => conversation.id === conversation_id
      );
      old.data.data[conversationIndex].total_unread_message = 0;
      return old;
    });
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
          {dataConversations &&
            dataConversations.map((conversation) => (
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
