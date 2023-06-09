import * as React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../public/animations/students-lottie.json';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
interface ILeftSideProps {
  toggle: boolean;
  setToggle: (value: boolean) => void;
}

const LeftSide: React.FunctionComponent<ILeftSideProps> = ({
  toggle,
  setToggle,
}) => {
  return (
    <Flex
      bg="blue.500"
      alignItems="center"
      direction="column"
      justifyContent="center"
      width={{ sm: '100%', md: '50%' }}
      display={{ sm: toggle ? 'flex' : 'none', md: 'flex' }}
      p={5}
      gap={5}
    >
      <Lottie className="sm:w-3/4" animationData={animationData} />

      <Text
        color="white"
        as="b"
        fontSize={{ sm: '2xl', md: 'xl', lg: '2xl' }}
        textAlign="center"
      >
        Welcome to Social Media <br />
        University Esa Unggul
      </Text>

      <Text
        color="white"
        fontSize={{ sm: 'xs', xl: 'medium' }}
        textAlign="center"
        className="max-w-[75%]"
      >
        Login to connect with fellow students, professors, alumni and stay
        updated with the latest news, events, and discussions.
      </Text>
      <Button
        // colorScheme="white"
        // variant="solid"
        color="blue.500"
        onClick={() => setToggle(false)}
        display={{ md: 'none' }}
        width="75%"
      >
        Log In
      </Button>
    </Flex>
  );
};

export default LeftSide;
