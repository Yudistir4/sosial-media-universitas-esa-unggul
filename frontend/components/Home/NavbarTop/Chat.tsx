import NavLink from '@/components/NavLink';
import useConversation from '@/store/conversation';
import { IconButton } from '@chakra-ui/react';
import * as React from 'react';
import { IoChatbubbles } from 'react-icons/io5';

interface IChatProps {}

const Chat: React.FunctionComponent<IChatProps> = (props) => {
  const conversations = useConversation((state) => state.conversations);
  let totalUnreadMessages = 0;
  conversations.forEach(
    (item) => (totalUnreadMessages += item.total_unread_message)
  );
  return (
    <div className="relative">
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
      {totalUnreadMessages > 0 && (
        <div className="flex items-center font-semibold text-white justify-center text-xs absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500">
          {totalUnreadMessages}
        </div>
      )}
    </div>
  );
};

export default Chat;
