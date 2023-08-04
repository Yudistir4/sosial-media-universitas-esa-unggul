import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from '@chakra-ui/react';

import * as React from 'react';
import { IoMdAdd } from 'react-icons/io';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';
import CreateUser from './CreateUser';

import { useAuth } from '@/store/user';
import Feed from '../../Feed';
import { useCreatePostModal } from '@/store/createPostModal';
import { User } from '@/typing';

interface IQuestionsProps {
  user_id: string;
  user: User;
}

const Questions: React.FunctionComponent<IQuestionsProps> = ({
  user_id,
  user,
}) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const onOpen = useCreatePostModal((state) => state.onOpen);
  const [search, setSearch] = React.useState('');
  const loggedInUser = useAuth((state) => state.user);

  return (
    <Flex className="flex-col gap-4 mb-10">
      {user_id !== loggedInUser?.id && (
        <Button
          onClick={() => onOpen(user)}
          colorScheme="blue"
          className="self-start  "
          borderRadius={999}
          leftIcon={<IoMdAdd className="text-3xl" />}
        >
          Ask Questions
        </Button>
      )}
      <InputGroup>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          borderRadius={999}
        />
        <InputLeftElement className="cursor-pointer ">
          <IoSearchOutline className="text-xl" />
        </InputLeftElement>
        <InputRightElement
          onClick={() => setSearch('')}
          className="cursor-pointer "
        >
          <IoCloseOutline className="text-xl" />
        </InputRightElement>
      </InputGroup>
      <div className={search ? 'block' : 'hidden'}>
        <Feed to_user_id={user_id} post_category="question" caption={search}  isSearchMode={true}/>
      </div>

      <div className={search ? 'hidden' : 'block'}>
        <Tabs>
          <TabList>
            <Tab>Popular</Tab>
            <Tab>Recent</Tab>
            <Tab>Not Yet Answered</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <Feed
                to_user_id={user_id}
                post_category="question"
                popular={true}
              />
            </TabPanel>
            <TabPanel px={0}>
              <Feed to_user_id={user_id} post_category="question" />
            </TabPanel>
            <TabPanel px={0}>
              <Feed
                to_user_id={user_id}
                post_category="question"
                not_answered={true}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      {/* {loggedInUser && (
        <CreateUser
          isOpen={isOpen}
          onClose={onClose}
          loggedInUserID={loggedInUser.id}
          to_user_id={user_id}
        />
      )} */}
    </Flex>
  );
};

export default Questions;
