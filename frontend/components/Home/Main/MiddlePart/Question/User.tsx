import moment from 'moment';
import * as React from 'react';

interface IUserProps {
  post: PostDoc;
  showRecipient?: boolean;
}

import { PostDoc } from '@/typing';
import { Avatar, AvatarGroup, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
const User: React.FunctionComponent<IUserProps> = ({ post, showRecipient }) => {
  return (
    <Flex gap={2} className="items-center">
      {showRecipient ? (
        <AvatarGroup size="sm" max={2}>
          <Avatar bg="gray.400" src={post.user.profile_pic_url} />
          <Avatar bg="gray.400" src={post.to_user.profile_pic_url} />
        </AvatarGroup>
      ) : (
        <Link href={`/?user_id=${post.user.id}`}>
          <Avatar bg="gray.400" size="sm" src={post.user.profile_pic_url} />
        </Link>
      )}
      <Flex className="flex-col justify-center">
        <Flex className="items-center gap-2">
          <Link href={`/?user_id=${post.user.id}`}>
            <Text className="font-semibold text-sm" noOfLines={1}>
              {post.user.name}
            </Text>
          </Link>
          {showRecipient && (
            <>
              <Text>asked</Text>
              <Link href={`/?user_id=${post.to_user.id}`}>
                <Text className="font-semibold text-sm" noOfLines={1}>
                  {post.to_user.name}
                </Text>
              </Link>
            </>
          )}
        </Flex>
        <Text className="font-light text-xs">
          {moment(post.created_at).fromNow()}
        </Text>
      </Flex>
    </Flex>
  );
};

export default User;
