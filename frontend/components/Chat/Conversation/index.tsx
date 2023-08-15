import { api } from '@/config';
import useConversation from '@/store/conversation';
import { FixedSizeList as List } from 'react-window';
import {
  Center,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Ref, RefObject, createRef, useEffect, useRef } from 'react';
import Message from './Message';

import { formatDate, getConversationUser } from '@/utils';
import { Socket } from 'socket.io-client';
import {
  AsReadPayload,
  ClientToServerEvents,
  MessageDoc,
  MessageSocket,
  Response,
  ServerToClientEvents,
} from '../../../typing';
import Header from './Header';
import InputMessage from './InputMessage';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useAuth } from '@/store/user';
import { client } from '@/services';

interface IConversationProps {
  socket: RefObject<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >;
}
interface Messages {
  date: string;
  messages: MessageDoc[];
}

const Conversation: React.FunctionComponent<IConversationProps> = ({
  socket,
}) => {
  const loggedInUser = useAuth((state) => state.user);
  const currentConversation = useConversation(
    (state) => state.currentConversation
  );
  const currentConversationUser = getConversationUser(
    currentConversation,
    loggedInUser
  );

  const queryClient = useQueryClient();
  const conversationRef = useRef<HTMLDivElement>();
  const listRef = useRef<List>(null);

  // Query Messages
  const { data: dataMessage } = useQuery({
    queryKey: ['message', currentConversation?.id],
    enabled: !!currentConversation,
    refetchOnWindowFocus: false,

    queryFn: async () => {
      const res = await client.get<Response<MessageDoc[]>>(
        `${api.conversations}/${currentConversation?.id}/messages`
      );
      return res.data;
    },
    select: (res) => {
      const data = res.data ?? [];

      if (data.length === 0) return [];
      const messages = data.reduce((accumulator: Messages[], current) => {
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
      }, []);

      const allMessages: (string | MessageDoc)[] = [];
      messages?.forEach((item) => {
        allMessages.push(item.date);
        item.messages.forEach((message) => allMessages.push(message));
      });
      return allMessages;
    },
  });

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
    const mySocket = socket.current;
    function onReceiveMessage(message: MessageSocket) {
      console.log({ message });
      const { sender_id, conversation_id } = message;

      if (queryClient.getQueryData(['message', message.conversation_id])) {
        queryClient.setQueryData(
          ['message', message.conversation_id],
          (old: any) => ({ data: [...old.data, message] })
        );

        if (currentConversation?.id === message.conversation_id) {
          updateIsReadMessage({ sender_id, conversation_id });
          mySocket?.emit('markAsRead', { sender_id, conversation_id });
        }
      }
    }

    function onReceiveAsReadStatus({ conversation_id }: AsReadPayload) {
      if (queryClient.getQueryData(['message', conversation_id])) {
        console.log('Mark as read---2');
        queryClient.setQueryData(['message', conversation_id], (old: any) => ({
          data: old.data.map((message: MessageDoc) => ({
            ...message,
            is_read: true,
          })),
        }));
      }
    }
    mySocket?.on('receiveMessage', onReceiveMessage);
    mySocket?.on('receiveAsReadStatus', onReceiveAsReadStatus);

    return () => {
      mySocket?.off('receiveMessage', onReceiveMessage);
      mySocket?.off('receiveAsReadStatus', onReceiveAsReadStatus);
    };
  }, [socket, currentConversation, queryClient, updateIsReadMessage]);

  const bgDate = useColorModeValue('blackAlpha.200', 'whiteAlpha.100');

  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <Flex direction="column" gap={2} key={index}>
        {typeof dataMessage?.[index] === 'string' ? (
          <Center>
            <Text bg={bgDate} px={4} py={1} borderRadius="xl">
              {dataMessage?.[index] as string}
            </Text>
          </Center>
        ) : (
          <Message
            key={(dataMessage?.[index] as MessageDoc)?.id}
            message={dataMessage?.[index] as MessageDoc}
            isOwn={
              (dataMessage?.[index] as MessageDoc).sender_id ===
              loggedInUser?.id
            }
          />
        )}
      </Flex>
    </div>
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(dataMessage?.length ?? 0 - 1);
    }
  }, [dataMessage]); //
  return (
    <>
      {currentConversation ? (
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
                itemCount={dataMessage?.length ?? 0}
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
      ) : (
        <Center
          display={{ sm: currentConversation ? 'flex' : 'none', md: 'flex' }}
          width={{
            sm: currentConversation ? '100%' : '0',
            md: '50%',
            lg: 'calc(100% - 400px)',
          }}
        >
          <Text fontSize="3xl">Lets Start Conversation </Text>
        </Center>
      )}
    </>
  );
};

export default Conversation;
