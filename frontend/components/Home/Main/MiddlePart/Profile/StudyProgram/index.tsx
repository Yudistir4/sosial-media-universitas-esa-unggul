import { api } from '@/config';
import { client } from '@/services';
import { useAuth } from '@/store/user';
import { Response, StudyProgram } from '@/typing';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { IoMdAdd } from 'react-icons/io';
import CreateStudyProgram from './CreateStudyProgram';
import StudyProgramRow from './StudyProgramRow';
interface IAppProps {
  userID: string;
  facultyID: string;
}

const App: React.FunctionComponent<IAppProps> = ({ userID, facultyID }) => {
  const {
    isOpen: isCreateStudyProgramOpen,
    onOpen: openCreateStudyProgram,
    onClose: closeCreateStudyProgram,
  } = useDisclosure();

  const { data: studyprograms } = useQuery<Response<[StudyProgram]>>({
    queryKey: ['studyprograms', facultyID],
    queryFn: async () => {
      const res = await client.get(
        api.studyprograms + '?faculty_id=' + facultyID
      );
      return res.data;
    },
  });
  const loggedInUser = useAuth((state) => state.user);
  return (
    <Flex className="flex-col gap-4">
      {userID === loggedInUser?.id &&
        loggedInUser?.user_type === 'university' && (
          <>
            <Button
              onClick={openCreateStudyProgram}
              colorScheme="blue"
              className="self-start"
              borderRadius={999}
              leftIcon={<IoMdAdd className="text-3xl" />}
            >
              Add Study Program
            </Button>
          </>
        )}

      <Flex className="flex-col gap-2">
        {studyprograms?.data?.map((row) => (
          <StudyProgramRow
            row={row}
            facultyID={facultyID}
            userID={userID}
            loggedInUser={loggedInUser}
            key={row.id}
          />
        ))}
      </Flex>
      {userID === loggedInUser?.id &&
        loggedInUser?.user_type === 'university' && (
          <>
            <CreateStudyProgram
              isOpen={isCreateStudyProgramOpen}
              onClose={closeCreateStudyProgram}
              facultyID={facultyID}
            />
          </>
        )}
    </Flex>
  );
};

export default App;
