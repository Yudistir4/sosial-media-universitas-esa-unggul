import * as React from 'react';
import { Box, Avatar, Flex } from '@chakra-ui/react';
import Post from './Post';

interface IFeedProps {}

const Feed: React.FunctionComponent<IFeedProps> = (props) => {
  return (
    <Flex direction="column" gap={2} zIndex={0} className="  h-full z-0  ">
      {[1, 2, 3, 4, 5].map((value) => (
        <Post key={value} />
      ))}
    </Flex>
  );
};

export default Feed;
