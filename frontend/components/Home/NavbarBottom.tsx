import { useCreatePostModal } from '@/store/createPostModal';
import { useAuth } from '@/store/user';
import { Avatar, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { GrAdd } from 'react-icons/gr';
import NavLink from '../Navlink';

interface INavbarBottomProps {}

const NavbarBottom: React.FunctionComponent<INavbarBottomProps> = (props) => {
  const onOpen = useCreatePostModal((state) => state.onOpen);
  const user = useAuth((state) => state.user);
  return (
    <Flex
      display={{ sm: 'flex', lg: 'none' }}
      boxShadow="0px -4px 8px 0px rgba(0, 0, 0, 0.1)"
      className="bg-white z-10 w-full  text-2xl  gap-4 shadow-md shadow- shadow-black/20 items-center fixed bottom-0 justify-evenly"
    >
      <NavLink href="/" className="h-full p-3 ">
        <AiFillHome />
      </NavLink>
      <Link onClick={() => onOpen()} href="/" className="h-full p-3">
        <GrAdd />
      </Link>

      <NavLink href="/?saved=true" className="h-full p-3 ">
        <BsFillBookmarkFill />
      </NavLink>
      <Link href={`/?user_id=${user?.id}`} className="h-full p-2">
        <Avatar src={user?.profile_pic_url} size="sm" />
      </Link>
    </Flex>
  );
};

export default NavbarBottom;
