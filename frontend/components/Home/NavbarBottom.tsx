import * as React from 'react';
import {
  Box,
  Input,
  Flex,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Avatar,
} from '@chakra-ui/react';
import { AiFillHome } from 'react-icons/ai';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { GrAdd } from 'react-icons/gr';
import Link from 'next/link';
import Image from 'next/image';

interface INavbarBottomProps {}

const NavbarBottom: React.FunctionComponent<INavbarBottomProps> = (props) => {
  return (
    <Flex
      display={{ sm: 'flex', lg: 'none' }}
      boxShadow="0px -4px 8px 0px rgba(0, 0, 0, 0.1)"
      className="bg-white z-10 w-full  text-2xl  gap-4 shadow-md shadow- shadow-black/20 items-center fixed bottom-0 justify-evenly"
    >
      <Link href="/" className="h-full p-3">
        <AiFillHome />
      </Link>
      <Link href="/" className="h-full p-3">
        <GrAdd />
      </Link>
      <Link href="/" className="h-full p-3">
        <BsFillBookmarkFill />
      </Link>
      <Link href="/" className="h-full p-2">
        <Avatar size="sm" />
      </Link>
    </Flex>
  );
};

export default NavbarBottom;
