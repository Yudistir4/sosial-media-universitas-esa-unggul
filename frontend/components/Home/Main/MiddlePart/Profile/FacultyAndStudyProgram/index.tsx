import {
  Accordion,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';

import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { Response, User } from '@/typing';

import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { IoMdAdd } from 'react-icons/io';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreateUser from './CreateUser';
import UserComponent from './UserComponent';
import { AiOutlineWarning } from 'react-icons/ai';

interface IFacultyProps {}

const Faculty: React.FunctionComponent<IFacultyProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = React.useState('');
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    Response<[User]>,
    AxiosError<Response>
  >({
    queryKey: ['users', 'faculty', search],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get(
        `${api.users}${convertToQueryStr({
          name: search,
          user_type: 'faculty',
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
  });
  let itemLength = 0;
  data?.pages.map((page) => {
    if (page.data) {
      itemLength += page.data.length;
    }
  });

  return (
    <Flex className="flex-col gap-4 mb-10">
      <Button
        onClick={onOpen}
        colorScheme="blue"
        className="self-start"
        borderRadius={999}
        leftIcon={<IoMdAdd className="text-3xl" />}
      >
        Add Faculty
      </Button>
      <InputGroup>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          borderRadius={999}
        />
        <InputLeftElement className="cursor-pointer">
          <IoSearchOutline className="text-xl" />
        </InputLeftElement>
        <InputRightElement
          onClick={() => setSearch('')}
          className="cursor-pointer"
        >
          <IoCloseOutline className="text-xl" />
        </InputRightElement>
      </InputGroup>
      <InfiniteScroll
        className="flex flex-col gap-5 !overflow-visible"
        dataLength={itemLength} //This is important field to render the next data
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <div className="flex justify-center">
            <Spinner size="md" />
          </div>
        }
      >
        <Accordion defaultIndex={[0]} allowMultiple>
          {data?.pages.map((page) => {
            return page.data?.map((user) => (
              <UserComponent key={user.id} user={user} />
            ));
          })}
        </Accordion>
        {itemLength === 0 && !isLoading && search && (
          <Flex className="justify-center">
            <Button
              size="sm"
              borderRadius="full"
              leftIcon={<AiOutlineWarning />}
              colorScheme="yellow"
            >
              Data Not Found
            </Button>
          </Flex>
        )}
      </InfiniteScroll>
      <CreateUser isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Faculty;
