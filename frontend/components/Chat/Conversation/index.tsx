import { api } from '@/config';
import useConversation from '@/store/conversation';
import {
  Center,
  Flex,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { FixedSizeList as List } from 'react-window';

import React, { RefObject, useEffect, useRef } from 'react';
import Message from './Message';

import { client } from '@/services';
import { useAuth } from '@/store/user';
import { getConversationUser } from '@/utils';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ConversationDoc,
  MessageDoc,
  MessageSocket,
  ServerToClientEvents
} from '../../../typing';
import Header from './Header';
import InputMessage from './InputMessage';

interface IConversationProps {
  socket: RefObject<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >;
  currentConversation: ConversationDoc;
}
interface Messages {
  date: string;
  messages: MessageDoc[];
}

const Conversation: React.FunctionComponent<IConversationProps> = ({
  socket,
  currentConversation,
}) => {
  const loggedInUser = useAuth((state) => state.user);

  const currentConversationUser = getConversationUser(
    currentConversation,
    loggedInUser
  );

  const messageList = useConversation((state) => state.messageList);
  const getMessages = useConversation((state) => state.getMessages);

  const [messages, setMessages] = React.useState<any>([]);

  const listRef = useRef<List>(null);
  const onReceiveAsReadStatus = useConversation(
    (state) => state.onReceiveAsReadStatus
  );
  // Update all isRead Message
  const { mutate: updateIsReadMessage } = useMutation({
    mutationFn: async (data: {
      sender_id: string;
      conversation_id: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await client.put(
        `${api.conversations}/${data.conversation_id}/messages`,
        data
      );
    },
  });
  useEffect(() => {
    const get = async () => {
      await getMessages(currentConversation.id);
      setMessages(messageList[currentConversation.id]);
    };
    get();
  }, [currentConversation, getMessages, messageList]);

  useEffect(() => {
    const mySocket = socket.current;
    function onReceiveMessage(message: MessageSocket) {
      console.log({ message });
      const { sender_id, conversation_id } = message;

      if (currentConversation.id === message.conversation_id) {
        updateIsReadMessage({ sender_id, conversation_id });
        mySocket?.emit('markAsRead', { sender_id, conversation_id });
      }
    }

    mySocket?.on('receiveMessage', onReceiveMessage);
    mySocket?.on('receiveAsReadStatus', onReceiveAsReadStatus);

    return () => {
      mySocket?.off('receiveMessage', onReceiveMessage);
      mySocket?.off('receiveAsReadStatus', onReceiveAsReadStatus);
    };
  }, [socket, currentConversation, updateIsReadMessage, onReceiveAsReadStatus]);

  const bgDate = useColorModeValue('blackAlpha.200', 'whiteAlpha.100');

  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <Flex direction="column" gap={2} key={index}>
        {typeof messages?.[index] === 'string' ? (
          <Center>
            <Text bg={bgDate} px={4} py={1} borderRadius="xl">
              {messages?.[index] as string}
            </Text>
          </Center>
        ) : (
          <Message
            key={(messages?.[index] as MessageDoc)?.id}
            message={messages?.[index] as MessageDoc}
            isOwn={
              (messages?.[index] as MessageDoc).sender_id === loggedInUser?.id
            }
          />
        )}
      </Flex>
    </div>
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1);
    }
  }, [messages]); //
  return (
    <>
      <Flex
        display={{ sm: currentConversation ? 'flex' : 'none', md: 'flex' }}
        direction="column"
        position={'relative'}
        width={{
          sm: currentConversation ? '100%' : '0',
          md: '50%',
          lg: 'calc(100% - 400px)',
        }}
        height="100%"
      >
        {/* Header */}
        <Header currentConversationUser={currentConversationUser} />

        <AutoSizer className="px-2">
          {({ height, width }) => (
            <List
              ref={listRef}
              className="List"
              height={height - 128}
              itemCount={messages?.length ?? 0}
              itemSize={50}
              width={width - 8}
            >
              {Row}
            </List>
          )}
        </AutoSizer>

        {/* Input */}
        <InputMessage
          currentConversation={currentConversation}
          currentConversationUser={currentConversationUser}
          loggedInUser={loggedInUser}
          socket={socket}
        />
      </Flex>
    </>
  );
};

export default Conversation;
