import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { PostDoc, Response } from '@/typing';
import { Flex } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreatePost from './CreatePost';
import Post from './Post';

interface IFeedProps {
  user_id?: string;
  caption?: string;
}

const Feed: React.FunctionComponent<IFeedProps> = ({ user_id, caption }) => {
  // Fetch posts
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery<Response<[PostDoc]>, AxiosError<Response>>({
    queryKey: ['posts', user_id, caption],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get(
        `${api.posts}${convertToQueryStr({
          user_id,
          caption,
          page: pageParam,
          limit: 5,
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
      className="  h-full z-0  mb-20"
    >
      <CreatePost />
      <InfiniteScroll
        className="flex flex-col gap-4 !overflow-visible"
        dataLength={itemLength} //This is important field to render the next data
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {posts?.pages.map((page) => {
          return page.data?.map((post) => <Post key={post.id} post={post} />);
        })}
      </InfiniteScroll>
    </Flex>
  );
};

export default Feed;
