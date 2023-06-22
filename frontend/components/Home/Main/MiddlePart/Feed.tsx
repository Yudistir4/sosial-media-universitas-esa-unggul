import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { PostDoc, Response } from '@/typing';
import { Button, Flex, Spinner } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './Post';
import Question from './Question';

interface IFeedProps {
  user_id?: string;
  to_user_id?: string;
  caption?: string;
  post_category?: string;
  saved?: boolean;
  not_answered?: boolean;
  popular?: boolean;
  showRecipient?: boolean;
  isSearchMode?: boolean;
  customCallback?: () => void;
}

const Feed: React.FunctionComponent<IFeedProps> = ({
  user_id,
  to_user_id,
  caption,
  post_category,
  saved,
  not_answered,
  popular,
  showRecipient,
  isSearchMode,
  customCallback,
}) => {
  // Fetch posts
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery<Response<[PostDoc]>, AxiosError<Response>>({
    queryKey: [
      'posts',
      user_id,
      caption,
      post_category,
      saved,
      to_user_id,
      not_answered,
      popular,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get(
        `${api.posts}${convertToQueryStr({
          page: pageParam,
          limit: 5,
          user_id,
          caption,
          post_category,
          saved,
          to_user_id,
          not_answered,
          popular,
        })}`
      );
      return res.data;
    },
    getNextPageParam: (last: Response<[PostDoc]>, pages) => {
      if (last.data == null) {
        return false;
      }
      return pages.length + 1;
    },
  });
  let itemLength = 0;
  posts?.pages.map((page) => {
    if (page.data) {
      itemLength += page.data.length;
    }
  });

  isLoading && <div>Loading...</div>;
  return (
    <Flex
      paddingX={{ sm: 2, xl: 0 }}
      direction="column"
      gap={2}
      zIndex={0}
      className="  h-full z-0 mb-20"
    >
      <InfiniteScroll
        className="flex flex-col gap-4 !overflow-visible"
        dataLength={itemLength} //This is important field to render the next data
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <div className="flex justify-center">
            <Spinner size="md" />
          </div>
        }
      >
        {posts?.pages.map((page) => {
          return page.data?.map((post) =>
            post.post_category === 'question' ? (
              <Question
                key={post.id}
                post={post}
                customCallback={customCallback}
                caption={caption ? caption : ''}
                isSearchMode={isSearchMode ? isSearchMode : false}
                showRecipient={showRecipient ? showRecipient : false}
              />
            ) : (
              <Post
                customCallback={customCallback}
                caption={caption}
                isSearchMode={isSearchMode ? isSearchMode : false}
                key={post.id}
                post={post}
              />
            )
          );
        })}
        {itemLength === 0 && !isLoading && caption && (
          <Flex className="justify-center min-h-[200px] items-center">
            <Button
              size="sm"
              borderRadius="full"
              leftIcon={<AiOutlineWarning />}
              colorScheme="yellow"
            >
              {post_category === 'question'
                ? 'Question Not Found'
                : 'Post Not Found'}
            </Button>
          </Flex>
        )}
      </InfiniteScroll>
    </Flex>
  );
};

export default Feed;
