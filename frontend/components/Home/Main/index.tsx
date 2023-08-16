import * as React from 'react';
import MiddlePart from './MiddlePart';
import { Box, Flex } from '@chakra-ui/react';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/typing';
interface IMainProps { socket: React.RefObject<
  Socket<ServerToClientEvents, ClientToServerEvents> | undefined
>;}

const Main: React.FunctionComponent<IMainProps> = ({socket}) => {
  return (
    <Flex
      gap={4}
      className="max-w-[1280px] min-h-[200vh] m-auto pt-4"
      mt={{ sm: '96px', xl: '57px' }}
    >
      <SidebarLeft socket={socket} />
      <MiddlePart />
      <SidebarRight />
    </Flex>
  );
};

export default Main;
