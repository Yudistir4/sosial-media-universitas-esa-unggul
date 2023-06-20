import * as React from 'react';
import { Box } from '@chakra-ui/react';
import NavbarTop from './NavbarTop';
import NavbarBottom from './NavbarBottom';
import Main from './Main';
import CreatePost from './Main/MiddlePart/CreatePost';
import UpdateQuestion from './Main/MiddlePart/UpdateQuestion';
interface IHomeProps {}

let i = 0;
const Home: React.FunctionComponent<IHomeProps> = (props) => {
  return (
    <Box className="min-h-[100vh] relative" m="auto">
      <NavbarTop />
      <Main />
      <NavbarBottom />
      <CreatePost />
      <UpdateQuestion />
    </Box>
  );
};

export default Home;
