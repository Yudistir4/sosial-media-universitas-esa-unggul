import {
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
import { AiOutlineWarning } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreateUser from './CreateUser';
import UserComponent from './UserComponent';
import { useAuth } from '@/store/user';

interface IStudentsProps {
  faculty_id?: string;
  user_id: string;
}

const Students: React.FunctionComponent<IStudentsProps> = ({
  faculty_id,
  user_id,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = React.useState('');
  const loggedInUser = useAuth((state) => state.user);
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    Response<[User]>,
    AxiosError<Response>
  >({
    queryKey: ['users', 'student', search, faculty_id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get(
        `${api.users}${convertToQueryStr({
          name: search,
          user_type: 'student',
          faculty_id,
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
      {user_id === loggedInUser?.id &&
        loggedInUser?.user_type === 'university' && (
          <Button
            onClick={onOpen}
            colorScheme="blue"
            className="self-start"
            borderRadius={999}
            leftIcon={<IoMdAdd className="text-3xl" />}
          >
            Add Student
          </Button>
        )}
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

      {isLoading ? (
        <div
          className={`w-full flex items-center justify-center min-h-[50vh] `}
        >
          <Spinner size={'xl'} />
        </div>
      ) : (
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
          {data?.pages.map((page) => {
            return page.data?.map((user) => (
              <UserComponent key={user.id} user={user} />
            ));
          })}
          {itemLength === 0 && !isLoading && search && (
            <Flex className="justify-center mt-10">
              <Button
                size="sm"
                borderRadius="full"
                leftIcon={<AiOutlineWarning />}
                colorScheme="yellow"
              >
                Student Not Found
              </Button>
            </Flex>
          )}
        </InfiniteScroll>
      )}

      <CreateUser isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Students;
