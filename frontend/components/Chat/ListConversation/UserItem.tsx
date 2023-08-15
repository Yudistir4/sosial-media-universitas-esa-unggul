import { User } from '@/typing';
import { Avatar, Badge, Flex, Text } from '@chakra-ui/react';
import * as React from 'react';

interface IUserItemProps {
  onClick: () => void;
  user: User;
}

const UserItem: React.FunctionComponent<IUserItemProps> = ({
  user,
  onClick,
}) => {
  return (
    <Flex
      onClick={onClick}
      className="items-center gap-2  hover:bg-gray-100 transition-all cursor-pointer px-4 py-2"
    >
      <Avatar src={user.profile_pic_url} />
      <Flex className="flex-col justify-center">
        <Flex className="items-center gap-2">
          <Text as="b">{user.name}</Text>
          {['student', 'lecturer', 'alumni'].includes(
            user?.user_type as string
          ) && (
            <Badge
              variant="solid"
              borderRadius="full"
              px={3}
              colorScheme={
                user.user_type === 'student'
                  ? 'blue'
                  : user.user_type === 'alumni'
                  ? 'green'
                  : 'gray'
              }
            >
              {user?.user_type}
            </Badge>
          )}
        </Flex>
        <Flex className="items-center gap-2">
          <Text className="font-light text-sm">
            {user?.user_type === 'student'
              ? user?.student.nim
              : user?.lecturer.nidn}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserItem;
