import * as React from 'react';
import {
  Box,
  Input,
  Flex,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  IconButton,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { LuSettings2 } from 'react-icons/lu';
import { BsFillBookmarkFill } from 'react-icons/bs';
import Image from 'next/image';
import { GrAdd } from 'react-icons/gr';
import { useCreatePostModal } from '@/store/createPostModal';
import { useAuth } from '@/store/user';
// import Link from 'next/link';
import NavLink from '../../Navlink';
import { Link } from '@chakra-ui/next-js';

import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { Response, User } from '@/typing';

import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AiOutlineWarning } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import InfiniteScroll from 'react-infinite-scroll-component';
import UserComponent from './UserComponent';
interface IUserListProps {
  search: string;
  closeDropDown: () => void;
}

const UserList: React.FunctionComponent<IUserListProps> = ({
  search,
  closeDropDown,
}) => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, refetch } =
    useInfiniteQuery<Response<[User]>, AxiosError<Response>>({
      queryKey: ['users-search', search],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await client.get(
          `${api.users}${convertToQueryStr({
            query: search,
            page: pageParam,
            limit: 20,
          })}`
        );
        return res.data;
      },
      getNextPageParam: (last: Response<[User]>, pages) => {
        if (last.data == null) {
          return false;
        }
        return pages.length + 1;
      },
      enabled: false,
    });
  let itemLength = 0;
  data?.pages.map((page) => {
    if (page.data) {
      itemLength += page.data.length;
    }
  });

  React.useEffect(() => {
    if (!search) return;
    const timeout = setTimeout(() => refetch(), 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, refetch]);

  return (
    <>
      {isLoading && isFetching ? (
        <div className="flex w-full min-h-[200px] justify-center items-center">
          <Spinner size="md" />
        </div>
      ) : (
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          className="flex flex-col !overflow-visible"
          dataLength={itemLength} //This is important field to render the next data
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="flex justify-center">
              <Spinner size="md" />
            </div>
          }
        >
          {data?.pages.map((page) => {
            return page.data?.map((user) => (
              <div key={user.id} onClick={closeDropDown}>
                <UserComponent user={user} />
              </div>
            ));
          })}
          {itemLength === 0 && !isLoading && search && (
            <Flex className="justify-center min-h-[200px] items-center">
              <Button
                size="sm"
                borderRadius="full"
                leftIcon={<AiOutlineWarning />}
                colorScheme="yellow"
              >
                User Not Found
              </Button>
            </Flex>
          )}
        </InfiniteScroll>
      )}
    </>
  );
};

export default UserList;
