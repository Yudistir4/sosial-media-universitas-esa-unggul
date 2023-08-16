import { api } from '@/config';
import { Box, Input } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RefObject, useState } from 'react';
import { Socket } from 'socket.io-client';

import { v4 as uuidv4 } from 'uuid';
import {
  ClientToServerEvents,
  ConversationDoc,
  ServerToClientEvents,
  User,
  UserLittle,
} from '../../../typing';
import { client } from '@/services';

interface IInputMessageProps {
  loggedInUser: User | null;
  currentConversation: ConversationDoc | null;
  currentConversationUser: UserLittle | undefined;
  socket: RefObject<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >;
}

const InputMessage: React.FunctionComponent<IInputMessageProps> = ({
  loggedInUser,
  currentConversation,
  currentConversationUser,
  socket,
}) => {
  const [text, setText] = useState('');
  const { mutate: addMessageMutate } = useMutation({
    mutationFn: (message: {
      text: string;
      conversation_id: string;
      sender_id: string;
    }) =>
      client.post(
        `${api.conversations}/${message.conversation_id}/messages`,
        message
      ),
  });

  const queryClient = useQueryClient();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loggedInUser || !currentConversation || !text) return;

    addMessageMutate({
      text,
      conversation_id: currentConversation.id,
      sender_id: loggedInUser.id,
    });

    // add message
    const message = {
      id: uuidv4(),
      text,
      conversation_id: currentConversation.id,
      sender_id: loggedInUser.id,
      receiver_id: currentConversationUser?.id as string,
      created_at: new Date(),
    };

    socket.current?.emit('sendMessage', message);

    // Add message to message list
    queryClient.setQueryData(
      ['message', currentConversation.id],
      (old: any) => ({ data: old?.data ? [...old.data, message] : [message] })
    );

    // add message to lastMessage conversation list
    queryClient.setQueryData(['conversations'], (old: any) => {
      const conversationIndex: number = old?.data.data.findIndex(
        (conversation: any) => conversation.id === currentConversation.id
      );

      const updateLastMessage = (old: any, last_message: any): any => {
        let conversations = JSON.parse(JSON.stringify(old.data.data));
        const itemToMove = conversations[conversationIndex];
        conversations.splice(conversationIndex, 1);
        conversations.unshift({ ...itemToMove, last_message });
        return conversations;
      };

      if (conversationIndex >= 0) {
        return { data: { data: updateLastMessage(old, message) } };
      } else {
        return {
          data: {
            data: [
              { ...currentConversation, last_message: message },
              ...old.data.data,
            ],
          },
        };
      }
    });

    setText('');
  };
  return (
    <Box p={3} position={'absolute'} width="100%" bottom="0">
      <form onSubmit={onSubmit}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write message"
        />
      </form>
    </Box>
  );
};

export default InputMessage;
