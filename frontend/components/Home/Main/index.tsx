import * as React from 'react';
import MiddlePart from './MiddlePart';
import { Box, Flex } from '@chakra-ui/react';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
interface IMainProps {}

const Main: React.FunctionComponent<IMainProps> = (props) => {
  return (
    <Flex
      gap={4}
      className="max-w-[1280px] min-h-[200vh] m-auto pt-4"
      mt={{ sm: '96px', xl: '57px' }}
    >
      <SidebarLeft />
      <MiddlePart />
      <SidebarRight />
    </Flex>
  );
};

export default Main;
