import { api } from '@/config';
import { client } from '@/services';
import { useAuth } from '@/store/user';
import { Response, User } from '@/typing';
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

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const router = useRouter();
  const { query } = router;
  const userID = query.user_id;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading, isFetching } = useQuery<Response<User>>({
    queryFn: async () => {
      const res = await client.get(api.users + '/' + userID);
      return res.data;
    },
    queryKey: [userID],
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
            {['student', 'lecturer'].includes(user?.user_type as string) && (
              <Badge
                variant="solid"
                borderRadius="full"
                px={3}
                colorScheme={user?.user_type === 'student' ? 'blue' : 'gray'}
              >
                {user?.user_type}
              </Badge>
            )}
            <Text className="font-semibold text-xl my-2">{user?.name}</Text>
            {data && ['student', 'lecturer'].includes(data.data.user_type) && (
              <>
                <Link
                  href={`/?user_id=${
                    user?.user_type === 'student'
                      ? user?.student.faculty.id
                      : user?.lecturer.faculty.id
                  }`}
                >
                  <Text className="text-sm font-light hover:text-blue-500 transition-all">
                    {user?.user_type === 'student'
                      ? user?.student.faculty.name
                      : user?.lecturer.faculty.name}
                  </Text>
                </Link>
                <Text className="text-sm font-light">
                  {user?.user_type === 'student'
                    ? user?.student.study_program.name
                    : user?.lecturer.study_program.name}
                </Text>
                <Text className="text-sm font-light">
                  {user?.user_type === 'student'
                    ? user?.student.nim
                    : user?.lecturer.nidn}
                </Text>
              </>
            )}
          </Flex>

          {user && <Contact user={user} />}
          <Text className="mx-4 max-w-md">{user?.bio}</Text>
        </>
      )}

      <Tabs className="w-full mt-4">
        <TabList className="font-[600]  overflow-auto scrollbar-hide">
          <Tab>Post</Tab>
          <Tab>Q&A</Tab>
          {['university', 'faculty'].includes(user?.user_type as string) && (
            <>
              <Tab>Students</Tab>
              <Tab>Lecturers</Tab>
            </>
          )}
          {user?.user_type === 'faculty' && <Tab>Study Program</Tab>}
          {user?.user_type === 'university' && (
            <>
              <Tab>Organizations</Tab>
              <Tab flexShrink={0}>Faculty & Program Study</Tab>
            </>
          )}
        </TabList>

        <TabPanels>
          <TabPanel px={0}>{user && <Feed user_id={user.id} />}</TabPanel>
          <TabPanel>
            <p>Q & A!</p>
          </TabPanel>
          {['university', 'faculty'].includes(user?.user_type as string) && (
            <TabPanel>
              <Students
                faculty_id={user?.user_type === 'faculty' ? user.id : undefined}
              />
            </TabPanel>
          )}
          {['university', 'faculty'].includes(user?.user_type as string) && (
            <TabPanel>
              <Lecturers
                faculty_id={user?.user_type === 'faculty' ? user.id : undefined}
              />
            </TabPanel>
          )}
          {user?.user_type === 'faculty' && (
            <TabPanel>
              <StudyProgram
                userID={userID as string}
                facultyID={userID as string}
              />
            </TabPanel>
          )}
          {user?.user_type === 'university' && (
            <TabPanel>
              <Organization />
            </TabPanel>
          )}
          {user?.user_type === 'university' && (
            <TabPanel>
              <FacultyAndStudyProgram />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
      {isOpen && user && (
        <UpdateProfile isOpen={isOpen} onClose={onClose} user={user} />
      )}
    </Flex>
  );
};

export default Profile;
