import { Box, Flex } from '@chakra-ui/react';
import * as React from 'react';

import { Image } from '@chakra-ui/next-js';
import { IoArrowBackSharp } from 'react-icons/io5';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';
interface IRightSideProps {
  toggle: boolean;
  setToggle: (value: boolean) => void;
}

const RightSide: React.FunctionComponent<IRightSideProps> = ({
  toggle,
  setToggle,
}) => {
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  return (
    <Flex
      width={{ sm: '100%', md: '50%' }}
      alignItems="center"
      justifyContent="center"
      direction="column"
      display={{ sm: toggle ? 'none' : 'flex', md: 'flex' }}
      gap={10}
    >
      <Box
        onClick={() => setToggle(true)}
        display={{ md: 'none' }}
        className="absolute left-5 top-5 text-2xl cursor-pointer"
      >
        <IoArrowBackSharp />
      </Box>
      <Image src="/logo.png" width={150} height={150} alt="logo" />

      {!showForgotPassword ? (
        <LoginForm setShowForgotPassword={setShowForgotPassword} />
      ) : (
        <ForgotPasswordForm setShowForgotPassword={setShowForgotPassword} />
      )}
    </Flex>
  );
};

export default RightSide;
