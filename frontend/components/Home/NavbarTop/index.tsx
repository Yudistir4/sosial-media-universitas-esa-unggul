import { useCreatePostModal } from '@/store/createPostModal';
import { useAuth } from '@/store/user';
import { Avatar, Box, Flex, IconButton } from '@chakra-ui/react';
import Image from 'next/image';
import * as React from 'react';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { GrAdd } from 'react-icons/gr';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { Link } from '@chakra-ui/next-js';
import NavLink from '../../Navlink';
import Search from './Search';

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
            <Link href="/">
              <Image
                src="/assets/logo-long.png"
                width={150}
                height={40}
                alt="logo"
              />
            </Link>
          </Flex>

          <Search />

          <Flex
            width={{ lg: '30%', xl: '30%' }}
            gap={2}
            justifyContent={{ lg: 'right' }}
          >
            {/* notif */}
            <IconButton
              borderRadius="full"
              colorScheme="gray"
              aria-label="expand"
              icon={<IoIosNotificationsOutline className="text-2xl" />}
            />
            <Flex display={{ sm: 'none', lg: 'flex' }} gap={2}>
              <IconButton
                onClick={() => onOpen()}
                borderRadius="full"
                colorScheme="gray"
                aria-label="expand"
                icon={<GrAdd className="text-xl" />}
              />

              <NavLink href="/?saved=true">
                {({ isActive }) => (
                  <IconButton
                    borderRadius="full"
                    colorScheme={isActive ? 'blue' : 'gray'}
                    aria-label="expand"
                    icon={<BsFillBookmarkFill className="text-xl" />}
                  />
                )}
              </NavLink>

              <Link href={`/?user_id=${user?.id}`} className="h-full">
                <Avatar height="40px" width="40px" />
              </Link>
            </Flex>
          </Flex>
        </Flex>
        <Flex display={{ sm: 'flex', xl: 'none' }} className="justify-evenly">
          <Box display={{ sm: 'none', lg: 'block' }}>
            <NavLink href="/">Beranda</NavLink>
          </Box>
          <NavLink href="/?post_category=seminar">Seminar</NavLink>
          <NavLink href="/?post_category=scholarship">Scholarship</NavLink>
          <NavLink href="/?post_category=competition">Competition</NavLink>
          <NavLink href="/?post_category=internship">Internship</NavLink>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NavbarTop;
