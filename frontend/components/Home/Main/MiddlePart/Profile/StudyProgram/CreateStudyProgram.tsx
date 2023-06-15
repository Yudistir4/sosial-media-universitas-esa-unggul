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
import { ErrorResponse } from '@/typing';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
interface ICreateStudyProgramFormProps {
  isOpen: boolean;
  onClose: () => void;
  facultyID: string;
}
interface CreateStudyProgramForm {
  name: string;
  faculty_id: string;
}
const validationSchema = yup.object().shape({
  name: yup.string().trim().required(),
});
const CreateStudyProgramForm: React.FunctionComponent<
  ICreateStudyProgramFormProps
> = ({ isOpen, onClose, facultyID }) => {
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
  } = useForm<CreateStudyProgramForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      faculty_id: facultyID,
    },
  });
  const {
    mutate,
    error,
    isLoading: isLoadingCreate,
  } = useMutation({
    mutationFn: async (data: CreateStudyProgramForm) => {
      const res = await client.post(api.studyprograms, data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyprograms', facultyID] });
      toast({
        title: 'Create study program success',
        status: 'success',
      });
      reset();
      onClose();
    },
  });
  const onSubmit = (data: CreateStudyProgramForm) => mutate(data);
  const isFormEmpty = Object.keys(dirtyFields).length === 0;

  return (
    <div>
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
          <ModalHeader>Create Study Program</ModalHeader>
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
                      Create study program failed!
                    </AlertTitle>
                    <AlertDescription className="">
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
                isLoading={isLoadingCreate}
                colorScheme="blue"
                type="submit"
                mb={2}
              >
                Submit
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
          <AlertDialogHeader>Discard study program?</AlertDialogHeader>
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
    </div>
  );
};

export default CreateStudyProgramForm;
