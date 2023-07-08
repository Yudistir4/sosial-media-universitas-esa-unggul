import { api } from '@/config';
import { client } from '@/services';
import { useAuth } from '@/store/user';
import { ErrorResponse, OptionDoc, PollingDoc } from '@/typing';
import { Avatar, Button, Flex, Image, Text } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import moment from 'moment';
import Link from 'next/link';
import * as React from 'react';
import Countdown from './Countdown';
import MenuPolling from './MenuPolling';

interface IPollingProps {
  polling: PollingDoc;
  user_id?: string;
}

const Polling: React.FunctionComponent<IPollingProps> = ({
  polling,
  user_id,
}) => {
  const queryClient = useQueryClient();
  const [optionID, setOptionID] = React.useState(
    polling.user_choice?.option_id
  );
  const [disabled, setDisabled] = React.useState(
    new Date() > new Date(polling.end_date)
      ? true
      : polling.user_choice?.option_id
      ? true
      : polling.is_voter
      ? false
      : true
  );

  let totalAllVoters = polling.options.reduce(
    (acc, obj) => acc + obj.total_voters,
    0
  );
  const user = useAuth((state) => state.user);

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await client.patch(
        `${api.pollings}/${polling.id}/options/${optionID}`
      );
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      setDisabled(true);
      queryClient.invalidateQueries({ queryKey: ['pollings', user_id] });
      queryClient.invalidateQueries({ queryKey: ['polling', polling.id] });
    },
  });

  return (
    <div className="relative flex flex-col w-full justify-center items-center gap-4 border-2 rounded-xl p-4">
      {user?.id === polling.user.id && <MenuPolling polling={polling} />}

      <Flex className="flex-col justify-center items-center">
        <Link href={`/?user_id=${polling.user.id}`}>
          <Avatar
            size="sm"
            src={polling.user.profile_pic_url}
            bg={'gray.400'}
          />
        </Link>
        <Link href={`/?user_id=${polling.user.id}`}>
          <Text className="font-semibold text-gray-600">
            {polling.user.name}
          </Text>
        </Link>
        <Text className="font-light text-xs">
          {moment(polling.created_at).fromNow()}
        </Text>
      </Flex>
      <Text className="font-semibold text-2xl text-center">
        {polling.title}
      </Text>

      <Countdown datetime={polling.end_date} />

      {polling.options.map((option) => (
        <button
          key={option.id}
          onClick={() =>
            !disabled &&
            // polling.is_voter &&
            setOptionID((prev) => (prev === option.id ? '' : option.id))
          }
          className={`
          ${optionID === option.id && 'bg-gray-900 text-white'}
          w-full max-w-[400px]  items-center   rounded-lg ${
            polling.is_voter
              ? disabled
                ? 'cursor-auto   '
                : ' hover:bg-gray-900 hover:text-white'
              : 'cursor-auto '
          }  gap-2 relative overflow-hidden  duration-300 transition-all bg-gray-100 flex justify-between`}
        >
          <Text
            noOfLines={2}
            className={`font-semibold w-full py-2 pl-2 ${
              polling.use_image ? 'text-left' : 'text-center'
            }`}
          >
            {option.text}
          </Text>
          {option.image_url && (
            <Image
              src={option.image_url}
              alt="wkwk"
              width={50}
              h={50}
              className="mr-2 my-1 rounded-lg  bg-red-500 object-cover shrink-0"
            />
          )}

          {/* jika dia voter dan belum memilih=> hidden */}
          {/* jika dia voter dan belum memilih dan waktu habis => show */}
          {/* jika dia voter dan sudah memilih=> show */}
          {/* jika dia bukan voter => show */}
          {polling.is_voter ? (
            polling.user_choice && polling.user_choice.option_id ? (
              <Percentage totalAllVoters={totalAllVoters} option={option} />
            ) : (
              new Date() > new Date(polling.end_date) && (
                <Percentage totalAllVoters={totalAllVoters} option={option} />
              )
            )
          ) : (
            <Percentage totalAllVoters={totalAllVoters} option={option} />
          )}
        </button>
      ))}

      {!disabled && (
        <Button
          isDisabled={polling.is_voter ? (optionID ? false : true) : true}
          onClick={() => {
            optionID && mutate();
          }}
          className="w-full  max-w-[400px]"
          colorScheme={polling.is_voter ? 'blue' : 'gray'}
          isLoading={isLoading}
        >
          {polling.is_voter
            ? optionID
              ? 'Vote'
              : 'Select One'
            : 'You are not allowed to vote'}
        </Button>
      )}
    </div>
  );
};

export default Polling;

const Percentage = ({
  totalAllVoters,
  option,
}: {
  totalAllVoters: number;
  option: OptionDoc;
}) => {
  return (
    <>
      <div className="w-14 shrink-0"></div>
      <div className="bg-gray-900 absolute right-0 text-white font-semibold flex justify-center items-center  w-16 h-full ">
        {totalAllVoters > 0
          ? ((option.total_voters / totalAllVoters) * 100).toFixed(0)
          : 0}
        %
      </div>
    </>
  );
};
