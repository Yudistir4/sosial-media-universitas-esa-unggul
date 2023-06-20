import { useAuth } from '@/store/user';
import { PostDoc } from '@/typing';
import { Flex } from '@chakra-ui/react';
import * as React from 'react';
import Like from './Actions/Like';
import Caption from './Caption';
import Comment from './Comment';
import MenuPost from './MenuPost';
import User from './User';
interface IPostProps {
  post: PostDoc;
  showRecipient: boolean;
}

const Post: React.FunctionComponent<IPostProps> = ({ post, showRecipient }) => {
  const user = useAuth((state) => state.user);

  return (
    <Flex className="flex-col gap-1 py-3 bg-white  rounded-xl border-2">
      {/* Top */}
      <Flex className="justify-between items-center px-4">
        <User post={post} showRecipient={showRecipient} />
        {user?.id === post.user.id && <MenuPost post={post} />}
        {user?.id !== post.user.id && <Like post={post} />}
      </Flex>

      {/* render caption */}
      <Flex className="justify-between pr-2">
        {!post.content_file_url && <Caption text={post.caption} />}

        {user?.id === post.user.id && <Like post={post} />}
      </Flex>

      <Comment post={post} />
    </Flex>
  );
};

export default Post;
