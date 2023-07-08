import { api } from '@/config';
import { client } from '@/services';
import { PollingDoc, Response } from '@/typing';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import Polling from './Polling';

interface ISinglePollingProps {
  polling_id: string;
}

const SinglePolling: React.FunctionComponent<ISinglePollingProps> = ({
  polling_id,
}) => {
  const { data, isLoading, error } = useQuery<
    Response<PollingDoc>,
    AxiosError<Response>
  >({
    queryKey: ['polling', polling_id],
    queryFn: async () => {
      const res = await client.get(`${api.pollings}/${polling_id}`);
      return res.data;
    },
  });
  const polling = data?.data;
  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center min-h-[80vh]">
        <Spinner size="xl" />
      </div>
    );

  return (
    <Box mx={{ sm: 2, xl: 0 }}>
      {polling && <Polling polling={polling} />}
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

export default SinglePolling;
