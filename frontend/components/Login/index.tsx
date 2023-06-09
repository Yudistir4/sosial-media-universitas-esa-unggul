import { Box, Flex } from '@chakra-ui/react';
import * as React from 'react';
import LeftSide from './LeftSide';
import RightSide from './RigthSide';

interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const [toggle, setToggle] = React.useState(true);

  return (
    <Flex height="100vh">
      <LeftSide toggle={toggle} setToggle={setToggle} />
      <RightSide toggle={toggle} setToggle={setToggle} />
    </Flex>
  );
};

export default Login;
