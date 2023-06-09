import * as React from 'react';
import { Box } from '@chakra-ui/react';
import NavbarTop from './NavbarTop';
import NavbarBottom from './NavbarBottom';
import Main from './Main';
interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <Box className="h-[100vh] relative" bg="gray.50" m="auto">
      <NavbarTop />
      <Main />
      <NavbarBottom />
    </Box>
  );
};

export default Home;