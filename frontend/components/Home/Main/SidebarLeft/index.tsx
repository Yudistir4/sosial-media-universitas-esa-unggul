import NavLink from '@/components/NavLink';
import { useChangeEmailModal } from '@/store/changeEmailModal';
import { useChangePasswordModal } from '@/store/changePasswordModal';
import { useAuth } from '@/store/user';
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import * as React from 'react';
import { AiFillHome, AiFillSetting, AiOutlineMail } from 'react-icons/ai';
import { FaTrophy } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { GiAchievement } from 'react-icons/gi';
import { GrWorkshop } from 'react-icons/gr';
import { MdWork } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';

interface ISidebarLeftProps {}
const navLinksData = [
  { href: '/', icon: <AiFillHome className="text-xl mr-1" />, text: 'Home' },
  {
    href: '/?post_category=seminar',
    icon: <GrWorkshop className="text-xl mr-1" />,
    text: 'Seminar',
  },
  {
    href: '/?post_category=scholarship',
    icon: <GiAchievement className="text-2xl " />,
    text: 'Scholarship',
  },
  {
    href: '/?post_category=competition',
    icon: <FaTrophy className="text-xl mr-1" />,
    text: 'Competition',
  },
  {
    href: '/?post_category=internship',
    icon: <MdWork className="text-xl mr-1" />,
    text: 'Internship',
  },
];
const SidebarLeft: React.FunctionComponent<ISidebarLeftProps> = (props) => {
  const logout = useAuth((state) => state.logout);
  const openChangePassword = useChangePasswordModal((state) => state.onOpen);
  const openChangeEmail = useChangeEmailModal((state) => state.onOpen);
  return (
    <Box
      width={{ sm: '0', xl: '20%' }}
      display={{ sm: 'none', xl: 'block' }}
      position="relative"
    >
      <Box className="fixed top-[73px] max-w-[248px] w-[calc(100%-80%)]   ">
        <Flex className="flex-col gap-2 pl-4  h-[87vh] justify-between   ">
          <Flex className="flex-col gap-2">
            {navLinksData.map((link, i) => (
              <NavLink key={i} href={link.href}>
                {({ isActive }) => (
                  <Button
                    bg={isActive ? 'gray.100' : ''}
                    leftIcon={link.icon}
                    justifyContent="start"
                    className="w-full"
                  >
                    {link.text}
                  </Button>
                )}
              </NavLink>
            ))}
          </Flex>
          <Flex className="flex-col gap-2">
            <Menu>
              <MenuButton
                as={Button}
                bg="transparent"
                leftIcon={<AiFillSetting className="text-xl" />}
                justifyContent="start"
                className="w-full text-left"
              >
                Setting
              </MenuButton>
              <MenuList zIndex={999}>
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
              </MenuList>
            </Menu>
            <Button
              bg="transparent"
              onClick={logout}
              leftIcon={<FiLogOut className="text-xl" />}
              justifyContent="start"
              className="w-full"
            >
              Logout
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default SidebarLeft;
