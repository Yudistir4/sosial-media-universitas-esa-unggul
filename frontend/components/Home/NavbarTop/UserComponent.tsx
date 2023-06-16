import { User } from '@/typing';
import {
  Avatar,
  Badge,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import { MdOutlineDelete, MdOutlineModeEditOutline } from 'react-icons/md';

import { useAuth } from '@/store/user';
import { useRouter } from 'next/router';
interface IUserProps {
  user: User;
}

const UserComponent: React.FunctionComponent<IUserProps> = ({ user }) => {
  const loggedInUser = useAuth((state) => state.user);
  const router = useRouter();
  const { query } = router;
  const userID = query.user_id;

  return (
    <Link href={`/?user_id=${user.id}`} className="">
      {/* <Flex
        key={user.id}
        className="items-center gap-2 justify-between"
      > */}
      <Flex className="items-center gap-2  hover:bg-gray-100 transition-all cursor-pointer px-4 py-2">
        <Avatar src={user.profile_pic_url} />
        <Flex className="flex-col justify-center">
          <Flex className="items-center gap-2">
            <Text as="b">{user.name}</Text>
            {['student', 'lecturer'].includes(user?.user_type as string) && (
              <Badge
                variant="solid"
                borderRadius="full"
                px={3}
                colorScheme={user.user_type === 'student' ? 'blue' : 'gray'}
              >
                {user?.user_type}
              </Badge>
            )}
          </Flex>
          <Flex className="items-center gap-2">
            <Text className="font-light text-sm">
              {user?.user_type === 'student'
                ? user?.student.nim
                : user?.lecturer.nidn}
            </Text>
          </Flex>
        </Flex>
        {/* </Flex> */}
      </Flex>
    </Link>
  );
};

export default UserComponent;
