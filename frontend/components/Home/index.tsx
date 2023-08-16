import * as React from 'react';
import { Box } from '@chakra-ui/react';
import NavbarTop from './NavbarTop';
import NavbarBottom from './NavbarBottom';
import Main from './Main';
import CreatePost from './Main/MiddlePart/CreatePost';
import UpdateQuestion from './Main/MiddlePart/UpdateQuestion';
import UpdatePost from './Main/MiddlePart/UpdatePost';
import ChangePassword from './ChangePassword';
import ChangeEmail from './ChangeEmail';
import Chat from '../Chat';
import { useRouter } from 'next/router';
import {
  ClientToServerEvents,
  QueryParams,
  ServerToClientEvents,
  UserSocket,
} from '@/typing';
import { useAuth } from '@/store/user';
import { Socket, io } from 'socket.io-client';
import useConversation from '@/store/conversation';
import { getConversationUser } from '@/utils';
interface IHomeProps {}

let i = 0;
const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const router = useRouter();
  const { query } = router;
  const { chat } = query as unknown as QueryParams;

  const loggedInUser = useAuth((state) => state.user);
  const socket =
    React.useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const currentConversation = useConversation(
    (state) => state.currentConversation
  );
  const setIsCurrentConversationUserOnline = useConversation(
    (state) => state.setIsCurrentConversationUserOnline
  );
  const currentConversationUser = getConversationUser(
    currentConversation,
    loggedInUser
  );
  React.useEffect(() => {
    if (!socket.current) {
      socket.current = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
    }
  }, []);

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
