import useConversation from '@/store/conversation';
import {
  ClientToServerEvents,
  ConversationDoc,
  ServerToClientEvents,
} from '@/typing';
import { Center, Flex, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import Conversation from './Conversation';
import ListConversation from './ListConversation';

interface IChatProps {
  socket: React.RefObject<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >;
}
const Chat: React.FunctionComponent<IChatProps> = ({ socket }) => {
  const currentConversation = useConversation(
    (state) => state.currentConversation
  );
  return (
    <Flex
      height={{ sm: 'calc(100vh - 48px)', lg: '100vh', xl: '100vh' }}
      overflowX="hidden"
      // gap={4}
      className="max-w-[1280px]   m-auto"
      pt={{ sm: '106px', xl: '67px' }}
    >
      <ListConversation socket={socket} />
      {currentConversation ? (
        <Conversation
          socket={socket}
          currentConversation={currentConversation}
        />
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
    </Flex>
  );
};

export default Chat;
