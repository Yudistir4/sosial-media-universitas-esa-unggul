import useConversation from '@/store/conversation';
import { UserLittle } from '@/typing';
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { IoArrowBackOutline } from 'react-icons/io5';
interface IHeaderProps {
  currentConversationUser: UserLittle | undefined;
}

const Header: React.FunctionComponent<IHeaderProps> = ({
  currentConversationUser,
}) => {
  const isCurrentConversationUserOnline = useConversation(
    (state) => state.isCurrentConversationUserOnline
  );
  const setCurrentConversation = useConversation(
    (state) => state.setCurrentConversation
  );

  return (
    <Flex alignItems="center" gap={3} py={2} px={2} bg="whiteAlpha.200">
      <Box
        cursor="pointer"
        onClick={() => setCurrentConversation(null)}
        display={{ sm: 'block', md: 'none' }}
        borderRadius={100}
        p={2}
        _hover={{ bg: 'whiteAlpha.200' }}
      >
        <IoArrowBackOutline fontSize={25} />
      </Box>
      <Link href={`/?user_id=${currentConversationUser?.id}`}>
        <Avatar src={currentConversationUser?.profile_pic_url} bg="gray.400" />
      </Link>
      <Flex direction="column">
        <Link href={`/?user_id=${currentConversationUser?.id}`}>
          <Text fontWeight={500}>{currentConversationUser?.name}</Text>
        </Link>
        {isCurrentConversationUserOnline && <Text>online</Text>}
      </Flex>
    </Flex>
  );
};

export default Header;
