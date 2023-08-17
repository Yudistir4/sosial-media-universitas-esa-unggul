import useConversation from '@/store/conversation';
import { ConversationDoc } from '@/typing';
import { Avatar, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';

interface IConversationItemProps {
  conversation: ConversationDoc;
  isOnConversation: boolean;
}

const ConversationItem: React.FunctionComponent<IConversationItemProps> = ({
  conversation,
  isOnConversation,
}) => {
  const setCurrentConversation = useConversation(
    (state) => state.setCurrentConversation
  );
  const bg = useColorModeValue('blackAlpha.200', 'whiteAlpha.300');

  return (
    <Flex
      onClick={() => setCurrentConversation(conversation)}
      alignItems="center"
      gap={3}
      borderRadius={4}
      p={2}
      transition="all"
      transitionDuration="0.1s"
      cursor="pointer"
      width="full"
      bg={isOnConversation ? bg : ''}
      _hover={{ bg }}
    >
      <Avatar src={conversation.participants[0].profile_pic_url} />
      <Flex
        direction="column"
        width="70%"
        // flexGrow="1"
      >
        <Text className="font-semibold" isTruncated>
          {conversation.participants[0].name}
        </Text>
        <Text className="text-gray-600" isTruncated>
          {conversation.last_message.text}
        </Text>
      </Flex>
      {conversation.total_unread_message > 0 && (
        <Flex
          alignItems="center"
          justifyContent="center"
          borderRadius={100}
          w={7}
          h={7}
          bg="blue.500"
        >
          <Text color={'white'}>{conversation.total_unread_message}</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default ConversationItem;
