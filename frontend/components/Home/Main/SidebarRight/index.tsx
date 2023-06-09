import * as React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface ISidebarRightProps {}

const SidebarRight: React.FunctionComponent<ISidebarRightProps> = (props) => {
  return (
    <Box
      display={{ sm: 'none', lg: 'block' }}
      width={{ lg: '30%', xl: '30%' }}
      className="bg-blue-500"
    >
      <Text>sidebar right</Text>
    </Box>
  );
};

export default SidebarRight;
