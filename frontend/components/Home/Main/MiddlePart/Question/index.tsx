import { useAuth } from '@/store/user';
import { PostDoc } from '@/typing';
import { Flex } from '@chakra-ui/react';
import * as React from 'react';
import Like from './Actions/Like';
import Caption from './Caption';
import Comment from './Comment';
import MenuPost from './MenuPost';
import User from './User';
import { useRouter } from 'next/router';
interface IPostProps {
  post: PostDoc;
  caption?: string;
  showRecipient?: boolean;
  isSearchMode?: boolean;
  customCallback?: () => void;
}

const Post: React.FunctionComponent<IPostProps> = ({
  post,
  showRecipient,
  caption,
  isSearchMode,
  customCallback,
}) => {
  const user = useAuth((state) => state.user);
  const router = useRouter();
  return (
    <Flex
      onClick={() => {
        customCallback && customCallback();
        if (!isSearchMode) return;
        router.push(`/?post_id=${post.id}`);
      }}
      className={`${
        isSearchMode ? 'cursor-pointer' : ''
      } flex-col gap-1 py-3 bg-white  rounded-xl border-2`}
    >
      {/* Top */}
      <Flex className="justify-between items-center px-4">
        <User post={post} showRecipient={showRecipient} />
        {user?.id === post.user.id && <MenuPost post={post} />}
        {user?.id !== post.user.id && <Like post={post} />}
      </Flex>

      {/* render caption */}
      <Flex className="justify-between pr-2">
        {!post.content_file_url && (
          <Caption text={post.caption} caption={caption} />
        )}

        {user?.id === post.user.id && <Like post={post} />}
      </Flex>

      <Comment post={post} />
    </Flex>
  );
};

export default Post;
