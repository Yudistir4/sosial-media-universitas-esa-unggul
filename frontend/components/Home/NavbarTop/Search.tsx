import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import * as React from 'react';
// import Link from 'next/link';

import useClickOutside from '@/hooks/useClickOutside';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import Feed from '../Main/MiddlePart/Feed';
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
        placeholder="Search name, NIM, NIDN or post..."
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
            <TabPanel px={{ sm: 1, xl: 3 }}>
              {search && <Feed caption={search} />}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </InputGroup>
  );
};

export default Search;
