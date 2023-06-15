import { Response, StudyProgram, User } from '@/typing';
import {
  Avatar,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  CardBody,
  Card,
} from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import {
  MdOutlineDelete,
  MdOutlineExpandMore,
  MdOutlineModeEditOutline,
  MdOutlinePauseCircleOutline,
  MdOutlineExpandLess,
} from 'react-icons/md';
import DeleteUser from './DeleteUser';
import UpdateUser from './UpdateUser';
import { useAuth } from '@/store/user';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/config';
import { client } from '@/services';
import { IoMdAdd } from 'react-icons/io';
import StudyProgramComponent from '../StudyProgram';

interface IUserProps {
  user: User;
}

const UserComponent: React.FunctionComponent<IUserProps> = ({ user }) => {
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

  const loggedInUser = useAuth((state) => state.user);
  const router = useRouter();
  const { query } = router;
  const userID = query.user_id;

  return (
    <AccordionItem>
      {({ isExpanded }) => {
        return (
          <>
            <div>
              <AccordionButton as="div">
                <Box as="span" flex="1" textAlign="left">
                  <Flex
                    key={user.id}
                    className="items-center gap-2 justify-between mr-2"
                  >
                    <Flex className="items-center gap-2">
                      <Link href={`/?user_id=${user.id}`}>
                        <Avatar src={user.profile_pic_url} />
                      </Link>

                      <Link href={`/?user_id=${user.id}`}>
                        <Text as="b">{user.name}</Text>
                      </Link>
                    </Flex>
                    {userID === loggedInUser?.id &&
                      loggedInUser?.user_type === 'university' && (
                        <>
                          <Flex className="gap-2">
                            <IconButton
                              onClick={openEdit}
                              borderRadius={999}
                              colorScheme="blue"
                              aria-label="link"
                              icon={
                                <MdOutlineModeEditOutline className="text-2xl" />
                              }
                            />
                            <IconButton
                              onClick={openDelete}
                              borderRadius={999}
                              colorScheme="red"
                              aria-label="link"
                              icon={<MdOutlineDelete className="text-2xl" />}
                            />
                          </Flex>
                          <DeleteUser
                            user={user}
                            isOpen={isDeleteOpen}
                            onClose={closeDelete}
                          />
                          {isEditOpen && (
                            <UpdateUser
                              user={user}
                              isOpen={isEditOpen}
                              onClose={closeEdit}
                            />
                          )}
                        </>
                      )}
                  </Flex>
                </Box>
                {isExpanded ? (
                  <IconButton
                    borderRadius="full"
                    colorScheme="gray"
                    aria-label="expand"
                    icon={<MdOutlineExpandLess className="text-2xl" />}
                  />
                ) : (
                  <IconButton
                    borderRadius="full"
                    colorScheme="gray"
                    aria-label="less"
                    icon={<MdOutlineExpandMore className="text-2xl" />}
                  />
                )}
              </AccordionButton>
            </div>
            <AccordionPanel>
              {userID && (
                <StudyProgramComponent
                  userID={userID as string}
                  facultyID={user.id}
                />
              )}
            </AccordionPanel>
          </>
        );
      }}
    </AccordionItem>
  );
};

export default UserComponent;
