import { Flex, SkeletonCircle, Spinner } from '@chakra-ui/react';
import * as React from 'react';

interface ILoadingProps {}

const Loading: React.FunctionComponent<ILoadingProps> = (props) => {
  return (
    <Flex className="w-full justify-center min-h-[200px] items-center bg-white">
      <Spinner size="xl" />
    </Flex>
  );
};

export default Loading;
