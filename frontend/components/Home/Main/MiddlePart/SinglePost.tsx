import * as React from 'react';
import Post from './Post';
import Question from './Question';
import { PostDoc, Response } from '@/typing';
import { AxiosError } from 'axios';
import { api } from '@/config';
import { client } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { AiOutlineWarning } from 'react-icons/ai';

interface ISinglePostProps {
  post_id: string;
}

const SinglePost: React.FunctionComponent<ISinglePostProps> = ({ post_id }) => {
  const { data, isLoading, error } = useQuery<
    Response<PostDoc>,
    AxiosError<Response>
  >({
    queryKey: ['post', post_id],
    queryFn: async () => {
      const res = await client.get(`${api.posts}/${post_id}`);
      return res.data;
    },
  });
  const post = data?.data;
  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center min-h-[80vh]">
        <Spinner size="xl" />
      </div>
    );

  return (
    <Box mx={{ sm: 2, xl: 0 }}>
      {post && (
        <>
          {post.post_category === 'question' ? (
            <Question post={post} showRecipient={true} />
          ) : (
            <Post post={post} />
          )}
        </>
      )}
      {error && error?.response?.status === 404 && (
        <Flex className="justify-center h-[80vh] items-center">
          <Button
            size="sm"
            borderRadius="full"
            leftIcon={<AiOutlineWarning />}
            colorScheme="yellow"
          >
            Not Found
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default SinglePost;
