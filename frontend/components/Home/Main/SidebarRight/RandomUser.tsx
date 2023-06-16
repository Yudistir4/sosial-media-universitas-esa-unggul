import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { PostDoc, Response, User } from '@/typing';
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import * as React from 'react';
interface IRandomUserProps {}

const RandomUser: React.FunctionComponent<IRandomUserProps> = (props) => {
  const {
    data: users,

    isLoading,
  } = useQuery<Response<[User]>, AxiosError<Response>>({
    queryKey: ['users', 'random'],
    queryFn: async () => {
      const res = await client.get(
        `${api.users}${convertToQueryStr({
          limit: 3,
          random: true,
        })}`
      );
      return res.data;
    },
    refetchInterval: 120000,
  });
  console.log(users);
  return (
    <Flex className="flex-col gap-2">
      <Heading size="sm">Suggested User</Heading>
      <Flex className="flex-col">
        {users?.data?.map((user) => (
          <Link
            key={user.id}
            href={`/?user_id=${user.id}`}
            className="flex items-center gap-2 hover:bg-gray-200 transition-all p-2 rounded-xl"
          >
            <Avatar src={user.profile_pic_url} />
            <Flex className="flex-col justify-center">
              <Flex className="items-center gap-2">
                <Text as="b">{user.name}</Text>
                {['student', 'lecturer'].includes(
                  user?.user_type as string
                ) && (
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
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

export default RandomUser;
