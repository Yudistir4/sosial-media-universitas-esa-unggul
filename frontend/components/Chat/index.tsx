import useConversation from '@/store/conversation';
import { ClientToServerEvents, ServerToClientEvents } from '@/typing';
import { Flex } from '@chakra-ui/react';
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
  const isNewConversation = useConversation((state) => state.isNewConversation);
  const setIsNewConversation = useConversation(
    (state) => state.setIsNewConversation
  );
  const setCurrentConversation = useConversation(
    (state) => state.setCurrentConversation
  );
    return (
    <Flex
      height={{ sm: '85vh', lg: '90vh', xl: '94vh' }}
      overflowX="hidden"
      // gap={4}
      className="max-w-[1280px]   m-auto pt-4"
      mt={{ sm: '96px', xl: '57px' }}
    >
      <ListConversation socket={socket} />
      <Conversation socket={socket} />
    </Flex>
  );
};

export default Chat;
