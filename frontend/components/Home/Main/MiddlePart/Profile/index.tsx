import { api } from '@/config';
import { client } from '@/services';
import { useAuth } from '@/store/user';
import { QueryParams, Response, User } from '@/typing';
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import Feed from '../Feed';
import Contact from './Contact';
import Loading from './Loading';
import Organization from './Organization';
import FacultyAndStudyProgram from './FacultyAndStudyProgram';
import UpdateProfile from './UpdateProfile';
import StudyProgram from './StudyProgram';
import Students from './Students';
import Lecturers from './Lecturers';
import Questions from './Questions';
import Pollings from './Pollings';
import { AiOutlineWarning } from 'react-icons/ai';
import { AxiosError } from 'axios';

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const router = useRouter();
  const { user_id } = router.query as unknown as QueryParams;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, isFetching, error } = useQuery<
    Response<User>,
    AxiosError<Response>
  >({
    queryFn: async () => {
      const res = await client.get(api.users + '/' + user_id);
      return res.data;
    },
    queryKey: [user_id],
    refetchOnWindowFocus: false,
  });

  const user = data?.data;

  const loggedInUser = useAuth((state) => state.user);
  if (isLoading) return <Loading />;

  return (
    <Flex className="flex-col items-center bg-white gap-4 pt-4">
      {isFetching ? (
        <Loading />
      ) : (
        user && (
          <>
            {loggedInUser?.id === user?.id && (
              <Button
                onClick={onOpen}
                borderRadius="full"
                colorScheme="blue"
                leftIcon={<MdOutlineModeEditOutline className="text-xl" />}
              >
                Edit Profile
              </Button>
            )}
            <Avatar src={user?.profile_pic_url} size="2xl" />
            <Flex className=" flex-col justify-center items-center">
              {['student', 'lecturer', 'alumni'].includes(user.user_type) && (
                <Badge
                  variant="solid"
                  borderRadius="full"
                  px={3}
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
              <Text className="font-semibold text-xl my-2 text-center mx-10">
                {user.name}
              </Text>
              {data &&
                ['student', 'lecturer', 'alumni'].includes(
                  data.data.user_type
                ) && (
                  <>
                    <Link
                      href={`/?user_id=${
                        user.user_type === 'student'
                          ? user.student.faculty.id
                          : user.lecturer.faculty.id
                      }`}
                    >
                      <Text className="text-sm font-light hover:text-blue-500 transition-all">
                        {['student', 'alumni'].includes(user.user_type)
                          ? user.student.faculty.name
                          : user.lecturer.faculty.name}
                      </Text>
                    </Link>
                    <Tooltip hasArrow label={'Program Studi'}>
                      <Text className="text-sm font-light">
                        {['student', 'alumni'].includes(user.user_type)
                          ? user.student.study_program.name
                          : user.lecturer.study_program.name}
                      </Text>
                    </Tooltip>
                    <Text className="text-sm font-light">
                      {['student', 'alumni'].includes(user.user_type)
                        ? user.student.nim
                        : user.lecturer.nidn}
                    </Text>
                    {['student', 'alumni'].includes(user.user_type) && (
                      <Tooltip hasArrow label="Campus Location">
                        <Text className="text-sm font-light">
                          {user.student.campus_location.replace(
                            /\b\w/g,
                            (char) => char.toUpperCase()
                          )}
                        </Text>
                      </Tooltip>
                    )}
                  </>
                )}
            </Flex>

            {user && <Contact user={user} />}
            <Text className="mx-4 max-w-md">{user?.bio}</Text>
          </>
        )
      )}
      {user_id && user && (
        <Tabs className="w-full mt-4">
          <div className="overflow-x-auto scrollbar-hide ">
            <TabList className="font-[600]  w-full">
              <Tab>Post</Tab>
              <Tab>Q&A</Tab>
              <Tab>Polling</Tab>
              {['university', 'faculty'].includes(user.user_type) && (
                <>
                  <Tab>Students</Tab>
                  <Tab>Lecturers</Tab>
                </>
              )}
              {user.user_type === 'faculty' && (
                <Tab borderColor="gray.200">Study Program</Tab>
              )}
              {user.user_type === 'university' && (
                <>
                  <Tab borderColor="gray.200">Organizations</Tab>
                  <Tab borderColor="gray.200" flexShrink={0}>
                    Faculty & Program Study
                  </Tab>
                </>
              )}
            </TabList>
          </div>
          <TabPanels>
            <TabPanel px={0}>{user && <Feed user_id={user_id} />}</TabPanel>
            <TabPanel px={2}>
              {user && <Questions user_id={user_id} user={user} />}
            </TabPanel>
            <TabPanel>{<Pollings user_id={user_id} />}</TabPanel>
            {['university', 'faculty'].includes(user.user_type) && (
              <TabPanel>
                <Students
                  user_id={user_id}
                  faculty_id={
                    user.user_type === 'faculty' ? user.id : undefined
                  }
                />
              </TabPanel>
            )}
            {['university', 'faculty'].includes(user.user_type) && (
              <TabPanel>
                <Lecturers
                  user_id={user_id}
                  faculty_id={
                    user.user_type === 'faculty' ? user.id : undefined
                  }
                />
              </TabPanel>
            )}
            {user.user_type === 'faculty' && (
              <TabPanel>
                <StudyProgram userID={user_id} facultyID={user_id} />
              </TabPanel>
            )}
            {user.user_type === 'university' && (
              <TabPanel>
                <Organization user_id={user_id} />
              </TabPanel>
            )}
            {user.user_type === 'university' && (
              <TabPanel>
                <FacultyAndStudyProgram user_id={user_id} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      )}
      {isOpen && user && (
        <UpdateProfile isOpen={isOpen} onClose={onClose} user={user} />
      )}
      {error && error?.response?.status === 404 && (
        <Flex className="justify-center h-[80vh] items-center">
          <Button
            size="md"
            borderRadius="full"
            leftIcon={<AiOutlineWarning />}
            colorScheme="yellow"
          >
            User Not Found
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Profile;
