import * as React from 'react';
import Feed from './Feed';
import { Box } from '@chakra-ui/react';
import Profile from './Profile';
interface IMiddlePartProps {}

const MiddlePart: React.FunctionComponent<IMiddlePartProps> = (props) => {
  return (
    <Box width={{ sm: '100%', lg: '75%', xl: '50%' }} className="">
      <Feed />
      {/* <Profile /> */}
    </Box>
  );
};

export default MiddlePart;
