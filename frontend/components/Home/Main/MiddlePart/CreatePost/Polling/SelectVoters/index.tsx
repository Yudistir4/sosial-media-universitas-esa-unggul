import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
// import Worker from './worker.js';
import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { Filter, Response, UserLittle2 } from '@/typing';

import { useAuth } from '@/store/user';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import { GoTriangleDown } from 'react-icons/go';
import InfiniteScroll from 'react-infinite-scroll-component';
import SelectedUsers from './SelectedUsers';
interface ISelectVotersProps {
  everyone: boolean;
  setEveryone: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUsers: UserLittle2[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<UserLittle2[]>>;
}
let i = 0;
const SelectVoters: React.FunctionComponent<ISelectVotersProps> = ({
  everyone,
  setEveryone,
  selectedUsers,
  setSelectedUsers,
}) => {
  const { onOpen, onClose: closePopover, isOpen } = useDisclosure();
  const loggedInUser = useAuth((state) => state.user);
  const [selectedFacultyFilter, setSelectedFacultyFilter] = React.useState('');
  const [selectedStudyprogramFilter, setSelectedStudyprogramFilter] =
    React.useState('');
  const [selectedUserTypeFilter, setSelectedUserTypeFilter] =
    React.useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = React.useState('');
  const { data: facultyFilter } = useQuery<
    Response<Filter[]>,
    AxiosError<Response>
  >({
    queryKey: ['faculty-filter'],
    queryFn: async () => {
      const res = await client.get(`${api.pollings}/faculty-filter`);
      return res.data;
    },
  });
  const { data: studyprogramFilter } = useQuery<
    Response<Filter[]>,
    AxiosError<Response>
  >({
    queryKey: ['studyprogram-filter', selectedFacultyFilter],
    queryFn: async () => {
      const res = await client.get(
        `${api.pollings}/study-program-filter${convertToQueryStr({
          faculty_id: selectedFacultyFilter,
        })}`
      );
      return res.data;
    },
  });
  const { data: batchesFilter } = useQuery<
    Response<number[]>,
    AxiosError<Response>
  >({
    queryKey: [
      'batches-filter',
      selectedFacultyFilter,
      selectedStudyprogramFilter,
    ],
    queryFn: async () => {
      const res = await client.get(
        `${api.pollings}/batches-filter${convertToQueryStr({
          faculty_id: selectedFacultyFilter,
          study_program_id: selectedStudyprogramFilter,
        })}`
      );
      return res.data;
    },
  });

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    Response<[UserLittle2]>,
    AxiosError<Response>
  >({
    queryKey: [
      'users',
      'student',
      selectedFacultyFilter,
      selectedStudyprogramFilter,
      selectedBatchFilter,
      selectedUserTypeFilter,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get(
        `${api.users}${convertToQueryStr({
          user_type: selectedUserTypeFilter,
          faculty_id: selectedFacultyFilter,
          study_program_id: selectedStudyprogramFilter,
          year: selectedBatchFilter,
          page: pageParam,
          limit: 20,
        })}`
      );
      return res.data;
    },
    getNextPageParam: (last: Response<[UserLittle2]>, pages) => {
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

  console.log({ data });

  return (
    <Flex className="items-center gap-2">
      <Avatar size="sm" src={loggedInUser?.profile_pic_url} />

      <div className="relative ">
        <Popover
          placement="bottom-end"
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={closePopover}
        >
          <PopoverTrigger>
            <Button
              justifyContent="flex-start"
              bg="transparent"
              variant="outline"
              borderRadius={'full'}
              rightIcon={<GoTriangleDown />}
            >
              {selectedUsers.length > 0
                ? `Selected (${selectedUsers.length})`
                : `Select a voter`}
            </Button>
          </PopoverTrigger>
          {/* <FormErrorMessage>{errors.to_user_id?.message}</FormErrorMessage> */}
          <PopoverContent className=" min-w-[400px] ">
            <PopoverArrow />

            <PopoverBody
              p={0}
              className="flex flex-col max-h-[400px] overflow-auto"
            >
              <SelectedUsers
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
              />

              <div className="flex p-2 gap-2 w-full">
                {facultyFilter?.data && (
                  <Select
                    value={selectedFacultyFilter}
                    onChange={(e) => {
                      setSelectedFacultyFilter(e.target.value);
                      setSelectedStudyprogramFilter('');
                      setSelectedUserTypeFilter('');
                      setSelectedBatchFilter('');
                    }}
                    maxWidth="25%"
                    size="xs"
                    borderRadius="full"
                    placeholder="faculty"
                    w="1/4"
                  >
                    {facultyFilter.data.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </Select>
                )}
                {selectedFacultyFilter && studyprogramFilter?.data && (
                  <Select
                    value={selectedStudyprogramFilter}
                    onChange={(e) => {
                      setSelectedStudyprogramFilter(e.target.value);
                      setSelectedUserTypeFilter('');
                      setSelectedBatchFilter('');
                    }}
                    maxWidth="25%"
                    size="xs"
                    borderRadius="full"
                    placeholder="study program"
                    w="1/4"
                  >
                    {studyprogramFilter.data.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </Select>
                )}

                {selectedStudyprogramFilter && (
                  <Select
                    value={selectedUserTypeFilter}
                    onChange={(e) => {
                      setSelectedUserTypeFilter(e.target.value);
                      setSelectedBatchFilter('');
                    }}
                    className=" "
                    size="xs"
                    borderRadius="full"
                    placeholder="user type"
                    w="1/4"
                  >
                    <option value="student">student</option>
                    <option value="lecturer">lecturer</option>
                  </Select>
                )}

                {selectedUserTypeFilter &&
                  selectedUserTypeFilter === 'student' &&
                  batchesFilter?.data && (
                    <Select
                      value={selectedBatchFilter}
                      onChange={(e) => setSelectedBatchFilter(e.target.value)}
                      maxWidth="25%"
                      size="xs"
                      borderRadius="full"
                      placeholder="year"
                      w="1/4"
                    >
                      {batchesFilter.data.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </Select>
                  )}
              </div>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    selectedUsers.forEach((user) => {
                      const element = document.getElementById(user.id);
                      if (element) {
                        element.click();
                      }
                    });

                    setSelectedUsers([]);
                  }

                  setEveryone(e.target.checked);
                }}
                px={2}
                h={10}
                colorScheme="blue"
                isChecked={everyone}
                // value={}
              >
                Everyone
              </Checkbox>
              <div className="flex flex-col  w-full">
                <InfiniteScroll
                  className="flex flex-col  !overflow-visible"
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
                    return page.data?.map((user) => {
                      if (user.id === loggedInUser?.id) return;
                      return (
                        <div
                          key={user.id}
                          className="hover:bg-gray-100 py-1  px-2"
                        >
                          <Checkbox
                            defaultChecked={
                              selectedUsers.find(
                                (selected) => selected.id === user.id
                              )
                                ? true
                                : false
                            }
                            id={user.id}
                            onChange={(e) => {
                              const startTime = performance.now();
                              if (e.target.checked) {
                                setSelectedUsers((prev) => [...prev, user]);
                                if (everyone) {
                                  setEveryone(false);
                                }
                              } else {
                                setSelectedUsers((prev) =>
                                  prev.filter(
                                    (oldUser) => oldUser.id !== user.id
                                  )
                                );
                              }
                              const endTime = performance.now();
                              const elapsedTime = endTime - startTime;
                              console.log(
                                'Time for setState:',
                                elapsedTime,
                                'milliseconds'
                              );
                            }}
                            colorScheme="blue"
                          >
                            <span className="flex gap-2 items-center">
                              <Avatar size="xs" />
                              <Text noOfLines={1} className="font-semibold">
                                {user.name}
                              </Text>
                              {['student', 'lecturer', 'alumni'].includes(
                                user.user_type
                              ) && (
                                <Badge
                                  variant="solid"
                                  borderRadius="full"
                                  px={2}
                                  colorScheme={
                                    user.user_type === 'student'
                                      ? 'blue'
                                      : user.user_type === 'alumni'
                                      ? 'green'
                                      : 'gray'
                                  }
                                >
                                  {user.user_type}
                                </Badge>
                              )}
                            </span>
                          </Checkbox>
                        </div>
                      );
                    });
                  })}
                  {itemLength === 0 && !isLoading && (
                    <Flex className="justify-center">
                      <Button
                        size="sm"
                        borderRadius="full"
                        leftIcon={<AiOutlineWarning />}
                        colorScheme="yellow"
                      >
                        Data Not Found
                      </Button>
                    </Flex>
                  )}
                </InfiniteScroll>
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
    </Flex>
  );
};

export default SelectVoters;
