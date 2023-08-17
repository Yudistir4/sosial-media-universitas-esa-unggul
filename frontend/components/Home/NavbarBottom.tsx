import { useCreatePostModal } from '@/store/createPostModal';
import { useAuth } from '@/store/user';
import { Avatar, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BsFillBookmarkFill } from 'react-icons/bs';
import { GrAdd } from 'react-icons/gr';
import NavLink from '../NavLink';
import { IoChatbubbles } from 'react-icons/io5';
import useConversation from '@/store/conversation';

interface INavbarBottomProps {}

const NavbarBottom: React.FunctionComponent<INavbarBottomProps> = (props) => {
  const onOpen = useCreatePostModal((state) => state.onOpen);
  const user = useAuth((state) => state.user);
  const conversations = useConversation((state) => state.conversations);
  let totalUnreadMessages = 0;
  conversations.forEach(
    (item) => (totalUnreadMessages += item.total_unread_message)
  );
  return (
    <Flex
      display={{ sm: 'flex', lg: 'none' }}
      boxShadow="0px -4px 8px 0px rgba(0, 0, 0, 0.1)"
      className="bg-white z-10 w-full  text-2xl  gap-4 shadow-md shadow- shadow-black/20 items-center fixed bottom-0 justify-evenly"
    >
      <NavLink href="/" className="h-full p-3 ">
        <AiFillHome />
      </NavLink>
      <NavLink href="/?chat=true" className="h-full p-3 relative">
        <IoChatbubbles />
        {totalUnreadMessages > 0 && (
          <div className="flex items-center font-semibold text-white justify-center text-xs absolute top-[2px] right-[2px] w-5 h-5 rounded-full bg-red-500">
            {totalUnreadMessages}
          </div>
        )}
      </NavLink>

      <Link onClick={() => onOpen()} href="/" className="h-full p-3">
        <GrAdd />
      </Link>

      <NavLink href="/?saved=true" className="h-full p-3 ">
        <BsFillBookmarkFill />
      </NavLink>
      <Link href={`/?user_id=${user?.id}`} className="h-full p-2">
        <Avatar src={user?.profile_pic_url} size="sm" bg="gray.400" />
      </Link>
    </Flex>
  );
};

export default NavbarBottom;
