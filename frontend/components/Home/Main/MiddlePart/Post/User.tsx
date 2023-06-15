import moment from 'moment';
import * as React from 'react';

interface IUserProps {
  post: PostDoc;
}

import { PostDoc } from '@/typing';
import { Avatar, Flex, Text } from '@chakra-ui/react';
const User: React.FunctionComponent<IUserProps> = ({ post }) => {
  return (
    <Flex gap={2} className="">
      <Avatar src={post.user.profile_pic_url} />
      <Flex className="flex-col justify-center">
        <Text className="font-semibold">{post.user.name}</Text>
        <Text fontSize="sm">{moment(post.created_at).fromNow()}</Text>
      </Flex>
    </Flex>
  );
};

export default User;
