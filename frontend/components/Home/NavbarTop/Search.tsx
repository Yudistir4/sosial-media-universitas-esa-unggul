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
import Feed from '../Main/MiddlePart/Feed';
import useClickOutside from '@/hooks/useClickOutside';
import UserList from './UserList';
interface ISearchProps {}

const Search: React.FunctionComponent<ISearchProps> = (props) => {
  const [search, setSearch] = React.useState('');
  const [isFocus, setIsFocus] = React.useState(false);
  const closeDropDown = () => setIsFocus(false);
  const ref = useClickOutside<HTMLDivElement>(closeDropDown);

  return (
    <InputGroup
      ref={ref}
      width={{ sm: 'full', lg: '70%', xl: '50%' }}
      className="relative"
    >
      <Input
        onFocus={() => setIsFocus(true)}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, NIM, NIDN or content"
        borderRadius="full"
      />
      <InputLeftElement className="cursor-pointer">
        <IoSearchOutline />
      </InputLeftElement>
      <InputRightElement
        onClick={() => setSearch('')}
        className="cursor-pointer"
      >
        <IoCloseOutline className="text-xl" />
      </InputRightElement>

      <div
        className={`${
          isFocus ? 'block' : 'hidden'
        } absolute top-12 shadow-all transition-all duration-200 bg-white  w-full rounded-xl overflow-hidden`}
      >
        <Tabs isFitted>
          <TabList>
            <Tab>User</Tab>
            <Tab>Post</Tab>
          </TabList>

          <TabPanels
            id="scrollableDiv"
            className="overflow-y-scroll min-h-[200px] max-h-[50vh]"
          >
            <TabPanel p={0}>
              <UserList search={search} closeDropDown={closeDropDown} />
            </TabPanel>
            <TabPanel p={0}>{search && <Feed caption={search} />}</TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </InputGroup>
  );
};

export default Search;
