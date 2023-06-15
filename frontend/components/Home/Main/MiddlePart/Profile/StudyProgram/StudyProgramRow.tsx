import { StudyProgram, User } from '@/typing';
import {
  Card,
  CardBody,
  Flex,
  IconButton,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import * as React from 'react';
import {
  MdOutlineDelete,
  MdOutlineModeEditOutline
} from 'react-icons/md';
import DeleteStudyProgram from './DeleteStudyProgram';
import UpdateStudyProgram from './UpdateStudyProgram';
interface IStudyProgramRowProps {
  userID: string;
  facultyID: string;
  row: StudyProgram;
  loggedInUser: User | null;
}

const StudyProgramRow: React.FunctionComponent<IStudyProgramRowProps> = ({
  userID,
  loggedInUser,
  row,
  facultyID,
}) => {
  const {
    isOpen: isDeleteOpen,
    onOpen: openDelete,
    onClose: closeDelete,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  return (
    <Card key={row.id}>
      <CardBody py={2} px={4} className="flex items-center justify-between">
        <Text className="font-semibold">{row.name} </Text>
        {userID === loggedInUser?.id &&
          loggedInUser?.user_type === 'university' && (
            <>
              <Flex className="gap-2">
                <IconButton
                  onClick={openEdit}
                  borderRadius={999}
                  colorScheme="blue"
                  aria-label="link"
                  icon={<MdOutlineModeEditOutline className="text-2xl" />}
                />
                <IconButton
                  onClick={openDelete}
                  borderRadius={999}
                  colorScheme="red"
                  aria-label="link"
                  icon={<MdOutlineDelete className="text-2xl" />}
                />
              </Flex>
              <DeleteStudyProgram
                facultyID={facultyID}
                studyProgramID={row.id}
                isOpen={isDeleteOpen}
                onClose={closeDelete}
              />
              {isEditOpen && (
                <UpdateStudyProgram
                  studyProgram={row}
                  facultyID={facultyID}
                  isOpen={isEditOpen}
                  onClose={closeEdit}
                />
              )}
            </>
          )}
      </CardBody>
    </Card>
  );
};

export default StudyProgramRow;
