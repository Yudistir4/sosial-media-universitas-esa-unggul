import moment from 'moment';
import * as React from 'react';

interface IUserProps {
  post: PostDoc;
}

import { PostDoc } from '@/typing';
import { Avatar, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
const User: React.FunctionComponent<IUserProps> = ({ post }) => {
  return (
    <Flex gap={2} className="">
      <Link href={`/?user_id=${post.user.id}`}>
        <Avatar src={post.user.profile_pic_url} />
      </Link>
      <Flex className="flex-col justify-center">
        <Link href={`/?user_id=${post.user.id}`}>
          <Text className="font-semibold">{post.user.name}</Text>
        </Link>
        <Text className="text-sm font-light">
          {moment(post.created_at).fromNow()}
        </Text>
      </Flex>
    </Flex>
  );
};

export default User;
