import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { PostDoc, Response } from '@/typing';
import { Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import * as React from 'react';
interface IRandomPostProps {}

const RandomPost: React.FunctionComponent<IRandomPostProps> = (props) => {
  const { data: posts } = useQuery<Response<[PostDoc]>, AxiosError<Response>>({
    queryKey: ['posts', 'random'],
    queryFn: async () => {
      const res = await client.get(
        `${api.posts}${convertToQueryStr({
          limit: 3,
          random: true,
        })}`
      );
      return res.data;
    },
    refetchInterval: 120000,
  });
  return (
    <Flex className="flex-col gap-2">
      <Heading size="sm">Suggested Post</Heading>
      <Flex className="flex-col ">
        {posts?.data?.map((post) => (
          <Link
            key={post.id}
            href={`/?post_id=${post.id}`}
            className="flex items-center gap-2 hover:bg-gray-200 transition-all p-2 rounded-xl"
          >
            {post.content_type === 'image' && (
              <Image
                src={post.content_file_url}
                className="aspect-square object-cover w-16 rounded-xl"
                alt="random"
              />
            )}
            {post.content_type === 'video' && (
              <video
                muted={true}
                src={post.content_file_url}
                className="aspect-square object-cover w-16 rounded-xl"
              ></video>
            )}
            <Text noOfLines={2}>{post.caption}</Text>
          </Link>
        ))}
      </Flex>
    </Flex>
  );
};

export default RandomPost;
