import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { PollingDoc, Response } from '@/typing';
import { Button, Flex, Spinner } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import InfiniteScroll from 'react-infinite-scroll-component';
import Polling from '../../Polling';

interface IFeedProps {
  user_id?: string;
  customCallback?: () => void;
}

const Feed: React.FunctionComponent<IFeedProps> = ({ user_id }) => {
  // Fetch pollings
  const {
    data: pollings,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery<Response<[PollingDoc]>, AxiosError<Response>>({
    queryKey: ['pollings', user_id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get(
        `${api.pollings}${convertToQueryStr({
          page: pageParam,
          limit: 5,
          user_id,
        })}`
      );
      return res.data;
    },
    getNextPageParam: (last: Response<[PollingDoc]>, pages) => {
      if (last.data == null) {
        return false;
      }
      return pages.length + 1;
    },
  });
  let itemLength = 0;
  pollings?.pages.map((page) => {
    if (page.data) {
      itemLength += page.data.length;
    }
  });

  if (isLoading)
    return (
      <div className={`w-full flex items-center justify-center min-h-[80vh] `}>
        <Spinner size={'xl'} />
      </div>
    );

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
        {pollings?.pages.map((page) => {
          return page.data?.map((polling) => (
            <Polling key={polling.id} polling={polling} user_id={user_id} />
          ));
        })}
        {itemLength === 0 && !isLoading && (
          <Flex className="justify-center min-h-[200px] items-center">
            <Button size="sm" borderRadius="full" colorScheme="gray">
              Polling Empty
            </Button>
          </Flex>
        )}
      </InfiniteScroll>
    </Flex>
  );
};

export default Feed;
