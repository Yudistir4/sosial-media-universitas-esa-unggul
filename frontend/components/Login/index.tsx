import { QueryParams } from '@/typing';
import { Flex } from '@chakra-ui/react';
import * as React from 'react';
import LeftSide from './LeftSide';
import RightSide from './RigthSide';

interface ILoginProps {
  queryParams: QueryParams;
}

const Login: React.FunctionComponent<ILoginProps> = ({ queryParams }) => {
  const [toggle, setToggle] = React.useState(true);

  return (
    <Flex height="100vh">
      <LeftSide toggle={toggle} setToggle={setToggle} />
      <RightSide
        toggle={toggle}
        setToggle={setToggle}
        queryParams={queryParams}
      />
    </Flex>
  );
};

export default Login;
