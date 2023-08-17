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
import useConversation from '@/store/conversation';

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
  const updateLastMessageInConversations = useConversation(
    (state) => state.updateLastMessageInConversations
  );
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loggedInUser || !currentConversation || !text) return;

    addMessageMutate({
      text,
      conversation_id: currentConversation.id,
      sender_id: loggedInUser.id,
    });

    // add message
    const message: any = {
      id: uuidv4(),
      text,
      conversation_id: currentConversation.id,
      sender_id: loggedInUser.id,
      receiver_id: currentConversationUser?.id as string,
      is_read: false,
      updated_at: new Date(),
      created_at: new Date(),
      sender: {
        id: loggedInUser.id,
        name: loggedInUser.name,
        profile_pic_url: loggedInUser.profile_pic_url,
      },
    };

    socket.current?.emit('sendMessage', message);

    // add message to lastMessage conversation list
    updateLastMessageInConversations(message);

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
