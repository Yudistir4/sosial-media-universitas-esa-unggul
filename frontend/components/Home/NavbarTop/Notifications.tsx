import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { NotificationDoc, Response } from '@/typing';
import {
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import InfiniteScroll from 'react-infinite-scroll-component';
import Notification from './Notification';
interface INotificationsProps {}

const Notifications: React.FunctionComponent<INotificationsProps> = (props) => {
  const [totalNotif, setTotalNotif] = React.useState<undefined | number>(
    undefined
  );
  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery<Response<[NotificationDoc]>, AxiosError<Response>>({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get(
        `${api.notifications}${convertToQueryStr({
          page: pageParam,
          limit: 20,
        })}`
      );
      return res.data;
    },
    refetchInterval: 60000,
    getNextPageParam: (last: Response<[NotificationDoc]>, pages) => {
      if (last.data == null) {
        return false;
      }
      return pages.length + 1;
    },
  });
  const { data: totalnotifications } = useQuery<
    Response<number>,
    AxiosError<Response>
  >({
    queryKey: ['total-notifications'],
    queryFn: async () => {
      const res = await client.get(`${api.notifications}/total`);
      return res.data;
    },
    refetchInterval: 60000,
  });

  React.useEffect(() => {
    if (totalnotifications?.data && totalnotifications.data !== 0) {
      setTotalNotif(totalnotifications?.data);
    }
  }, [totalnotifications]);

  const { mutate: markNotifsAsRead } = useMutation({
    mutationFn: async () => {
      const res = await client.patch(`${api.notifications}/read`);
      return res.data;
    },
    onSuccess: () => setTotalNotif(undefined),
  });
  let itemLength = 0;
  notifications?.pages.map((page) => {
    if (page.data) {
      itemLength += page.data.length;
    }
  });

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative">
          <IconButton
            borderRadius="full"
            colorScheme="gray"
            aria-label="notification"
            icon={<IoIosNotificationsOutline className="text-2xl" />}
          />
          {totalNotif && totalNotif !== 0 && (
            <div className="flex items-center font-semibold text-white justify-center text-xs absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500">
              {totalNotif}
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />

        <PopoverHeader className="flex justify-between items-center">
          <Text className="font-semibold">Notification</Text>
          <button
            onClick={() => {
              markNotifsAsRead();
            }}
            className="font-light text-sm hover:underline"
          >
            Mark all as read
          </button>
        </PopoverHeader>
        <PopoverBody
          id="notif"
          className="flex flex-col overflow-auto"
          p={0}
          maxH="400px"
        >
          <InfiniteScroll
            scrollableTarget="notif"
            className="flex flex-col  !overflow-visible"
            dataLength={itemLength} //This is important field to render the next data
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <div className="flex justify-center">
                <Spinner size="md" />
              </div>
            }
          >
            {notifications?.pages.map((page) => {
              return page.data?.map((notification) => (
                <Notification
                  key={notification.id}
                  notification={notification}
                />
              ));
            })}
            {itemLength === 0 && !isLoading && (
              <Flex className="justify-center min-h-[200px] items-center">
                <Button size="sm" borderRadius="full" colorScheme="gray">
                  Notification Empty
                </Button>
              </Flex>
            )}
          </InfiniteScroll>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
