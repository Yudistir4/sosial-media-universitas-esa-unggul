import { useChangeEmailModal } from '@/store/changeEmailModal';
import { useChangePasswordModal } from '@/store/changePasswordModal';
import { useCreatePostModal } from '@/store/createPostModal';
import { useAuth } from '@/store/user';
import { Link } from '@chakra-ui/next-js';
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import Image from 'next/image';
import * as React from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import { GrAdd } from 'react-icons/gr';
import { RiLockPasswordLine } from 'react-icons/ri';
import { RxHamburgerMenu } from 'react-icons/rx';
import NavLink from '../../NavLink';
import Notifications from './Notifications';
import Search from './Search';
import { IoChatbubbles } from 'react-icons/io5';

interface INavbarTopProps {}

const NavbarTop: React.FunctionComponent<INavbarTopProps> = (props) => {
  const onOpen = useCreatePostModal((state) => state.onOpen);
  const openChangePassword = useChangePasswordModal((state) => state.onOpen);
  const openChangeEmail = useChangeEmailModal((state) => state.onOpen);
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
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
            <Notifications />
            <Flex display={{ sm: 'none', lg: 'flex' }} gap={2}>
              <IconButton
                onClick={() => onOpen()}
                borderRadius="full"
                colorScheme="gray"
                aria-label="expand"
                icon={<GrAdd className="text-xl" />}
              />
              <NavLink href="/?chat=true">
                {({ isActive }) => (
                  <IconButton
                    borderRadius="full"
                    colorScheme={isActive ? 'blue' : 'gray'}
                    aria-label="expand"
                    icon={<IoChatbubbles className="text-xl" />}
                  />
                )}
              </NavLink>

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
            </Flex>
            <Menu>
              <MenuButton
                display={{ sm: 'flex', xl: 'none' }}
                borderRadius="full"
                as={IconButton}
                aria-label="Options"
                icon={<RxHamburgerMenu className="text-xl" />}
              />
              <MenuList>
                <MenuItem
                  onClick={openChangePassword}
                  icon={<RiLockPasswordLine className="text-xl" />}
                >
                  Change Password
                </MenuItem>
                <MenuItem
                  onClick={openChangeEmail}
                  icon={<AiOutlineMail className="text-xl" />}
                >
                  Change Email
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  icon={<FiLogOut className="text-xl" />}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>

            <Flex display={{ sm: 'none', lg: 'flex' }} gap={2}>
              <Link href={`/?user_id=${user?.id}`} className="h-full">
                <Avatar
                  src={user?.profile_pic_url}
                  height="40px"
                  width="40px"
                  bg="gray.400"
                />
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
