import * as React from 'react';
import { Box } from '@chakra-ui/react';

interface ISidebarLeftProps {}

const SidebarLeft: React.FunctionComponent<ISidebarLeftProps> = (props) => {
  return (
    <Box width={{ sm: '0', xl: '20%' }} display={{ sm: 'none', xl: 'block' }}>
      sidebar left
    </Box>
  );
};

export default SidebarLeft;
