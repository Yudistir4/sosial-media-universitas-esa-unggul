import useConversation from '@/store/conversation';
import { useAuth } from '@/store/user';
import {
  ClientToServerEvents,
  QueryParams,
  ServerToClientEvents,
  UserSocket,
} from '@/typing';
import { getConversationUser } from '@/utils';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { Socket, io } from 'socket.io-client';
import Chat from '../Chat';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import Main from './Main';
import CreatePost from './Main/MiddlePart/CreatePost';
import UpdatePost from './Main/MiddlePart/UpdatePost';
import UpdateQuestion from './Main/MiddlePart/UpdateQuestion';
import NavbarBottom from './NavbarBottom';
import NavbarTop from './NavbarTop';
interface IHomeProps {}

let i = 0;
const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const router = useRouter();
  const { query } = router;
  const { chat } = query as unknown as QueryParams;
  const receiveNewMessage = useConversation((state) => state.receiveNewMessage);

  const loggedInUser = useAuth((state) => state.user);
  const socket =
    React.useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const currentConversation = useConversation(
    (state) => state.currentConversation
  );
  const setIsCurrentConversationUserOnline = useConversation(
    (state) => state.setIsCurrentConversationUserOnline
  );
  const fetchConversations = useConversation(
    (state) => state.fetchConversations
  );
   
  const currentConversationUser = getConversationUser(
    currentConversation,
    loggedInUser
  );

  React.useEffect(() => {
    if (!socket.current) {
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
    }
    fetchConversations();
  }, [fetchConversations]);


  React.useEffect(() => {
    const mySocket = socket.current;
    mySocket?.on('receiveMessage', receiveNewMessage);
    return () => {
      mySocket?.off('receiveMessage', receiveNewMessage);
    };
  }, [socket, receiveNewMessage]);
  React.useEffect(() => {
    function onGetUsers(users: UserSocket[]) {
      console.log('getUsers---');
      setIsCurrentConversationUserOnline(
        !!users.find((user) => user.user_id === currentConversationUser?.id)
      );
    }
    socket.current?.emit('addUser', loggedInUser?.id as string);
    socket.current?.on('getUsers', onGetUsers);
    return () => {
      socket.current?.off('getUsers', onGetUsers);
    };
  }, [
    loggedInUser,
    currentConversationUser,
    setIsCurrentConversationUserOnline,
  ]);

  return (
    <Box className="relative" m="auto">
      <NavbarTop socket={socket} />

      {chat ? <Chat socket={socket} /> : <Main socket={socket} />}
      <NavbarBottom />
      <CreatePost />
      <UpdatePost />
      <UpdateQuestion />
      <ChangePassword />
      <ChangeEmail />
    </Box>
  );
};

export default Home;
