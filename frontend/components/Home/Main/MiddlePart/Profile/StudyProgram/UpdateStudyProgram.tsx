import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { api } from '@/config';
import { client } from '@/services';
import { ErrorResponse, StudyProgram } from '@/typing';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
interface IUpdateStudyProgramProps {
  isOpen: boolean;
  onClose: () => void;
  facultyID: string;
  studyProgram: StudyProgram;
}
interface UpdateStudyProgramForm {
  id: string;
  name: string;
}
const validationSchema = yup.object().shape({
  name: yup.string().trim().required(),
});
const UpdateStudyProgram: React.FunctionComponent<IUpdateStudyProgramProps> = ({
  isOpen,
  onClose,
  facultyID,
  studyProgram,
}) => {
  console.log(studyProgram);
  const toast = useToast();
  const {
    isOpen: isOpenAlert,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();
  const queryClient = useQueryClient();
  const cancelRef = React.useRef<any>();
  const {
    handleSubmit,
    register,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<UpdateStudyProgramForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: studyProgram.id,
      name: studyProgram.name,
    },
  });
  const {
    mutate,
    error,
    isLoading: isLoadingUpdate,
  } = useMutation({
    mutationFn: async (data: UpdateStudyProgramForm) => {
      const res = await client.put(
        api.studyprograms + '/' + studyProgram.id,
        data
      );
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyprograms', facultyID] });
      toast({
        title: 'Update study program success',
        status: 'success',
      });
      reset();
      onClose();
    },
  });
  const onSubmit = (data: UpdateStudyProgramForm) => mutate(data);
  const isFormEmpty = Object.keys(dirtyFields).length === 0;

  return (
    <>
      <Modal
        onClose={
          isFormEmpty
            ? () => {
                reset();
                onClose();
              }
            : openAlert
        }
        isOpen={isOpen}
      >
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader>Update Study Program</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {error && (
                <Alert status="error" className="items-center">
                  <AlertIcon />
                  <Flex className="flex-wrap">
                    <AlertTitle className="shrink-0">
                      Update study program failed!
                    </AlertTitle>
                    <AlertDescription className="shrink-0">
                      {error?.response?.data.error.message}
                    </AlertDescription>
                  </Flex>
                </Alert>
              )}
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input {...register('name')} placeholder="Name" />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <Button
                isLoading={isLoadingUpdate}
                colorScheme="blue"
                type="submit"
                mb={2}
              >
                Save
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
        isOpen={isOpenAlert}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent mx={2}>
          <AlertDialogHeader>Discard changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            If you leave, your edits won&apos;t be saved.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeAlert}>
              No
            </Button>
            <Button
              onClick={() => {
                reset();
                onClose();
                closeAlert();
              }}
              colorScheme="red"
              ml={3}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UpdateStudyProgram;
