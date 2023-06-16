import * as React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import RandomPost from './RandomPost';
import RandomUser from './RandomUser';

interface ISidebarRightProps {}

const SidebarRight: React.FunctionComponent<ISidebarRightProps> = (props) => {
  return (
    <Flex
      display={{ sm: 'none', lg: 'flex' }}
      width={{ lg: '30%', xl: '30%' }}
      className="mr-2 flex-col gap-10"
    >
      <RandomPost />
      <RandomUser />
      {/* Event */}
      {/* Trending Hastag */}
      {/* Suggested Organization */}
    </Flex>
  );
};

export default SidebarRight;
