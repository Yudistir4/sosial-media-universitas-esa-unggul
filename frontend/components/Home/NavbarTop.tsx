import * as React from 'react';
import {
  Box,
  Input,
  Flex,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Text,
  Avatar,
} from '@chakra-ui/react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';
import { LuSettings2 } from 'react-icons/lu';
import { BsFillBookmarkFill } from 'react-icons/bs';
import Image from 'next/image';
import { GrAdd } from 'react-icons/gr';
import { useCreatePostModal } from '@/store/createPostModal';
import { useAuth } from '@/store/user';
import { Link } from '@chakra-ui/next-js';
// import Link from 'next/link';

interface INavbarTopProps {}

const NavbarTop: React.FunctionComponent<INavbarTopProps> = (props) => {
  const onOpen = useCreatePostModal((state) => state.onOpen);
  const user = useAuth((state) => state.user);
  return (
    <Flex className="justify-center z-50 fixed top-0  w-full  bg-white shadow-md shadow-black/20 ">
      <Flex className="p-2 gap-4 w-full  max-w-[1280px]  " direction="column">
        <Flex className="gap-2">
          {/* Logo */}
          <Flex
            className="items-center gap-2"
            display={{ sm: 'none', xl: 'flex' }}
            width="20%"
          >
            <Image
              src="/assets/logo-long.png"
              width={150}
              height={40}
              alt="logo"
            />
            {/* <Text as="b" fontSize="md">
            Esa Unggul University
          </Text> */}
          </Flex>
          {/* search */}
          <InputGroup width={{ sm: 'full', lg: '70%', xl: '50%' }}>
            <Input
              onFocus={() => console.log('asik')}
              onBlur={() => console.log('wkwk')}
              placeholder="Search name, NIM, NIDN or content"
              borderRadius={999}
            />
            <InputLeftElement className="cursor-pointer">
              <IoSearchOutline />
            </InputLeftElement>
          </InputGroup>
          {/* notif */}
          <Flex
            width={{ lg: '30%', xl: '30%' }}
            gap={2}
            justifyContent={{ lg: 'right' }}
          >
            <IoIosNotificationsOutline className="cursor-pointer shrink-0 p-1 text-sm h-10 w-10 bg-gray-100 rounded-full" />
            <Flex display={{ sm: 'none', lg: 'flex' }} gap={2}>
              <button
                onClick={onOpen}
                className="items-center justify-center  w-10 h-10 flex bg-gray-100 rounded-full"
              >
                <GrAdd className="text-xl" />
              </button>
              <Link
                href="/"
                className="items-center justify-center  w-10 h-10 flex bg-gray-100 rounded-full"
              >
                <BsFillBookmarkFill className="text-xl" />
              </Link>
              <Link href={`/?user_id=${user?.id}`} className="h-full  ">
                <Avatar height="40px" width="40px" />
              </Link>
            </Flex>
          </Flex>
        </Flex>
        <Flex display={{ sm: 'flex', xl: 'none' }} className="justify-evenly">
          <Link display={{ sm: 'none', lg: 'block' }} href="/">
            Beranda
          </Link>
          <Link href="/">Seminar</Link>
          <Link href="/">Scholarship</Link>
          <Link href="/">Competition</Link>
          <Link href="/">Internship</Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NavbarTop;
