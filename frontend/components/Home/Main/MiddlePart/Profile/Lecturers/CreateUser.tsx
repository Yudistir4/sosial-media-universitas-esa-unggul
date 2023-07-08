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
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { ErrorResponse, Response, StudyProgram, User } from '@/typing';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
interface ICreateUserLecturerFormProps {
  isOpen: boolean;
  onClose: () => void;
}
interface CreateLecturerForm {
  name: string;
  email: string;
  user_type: string;
  nidn: string;
  faculty_id: string;
  study_program_id: string;
}
const validationSchema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().trim().email().required(),
  user_type: yup.string().required(),
  nidn: yup.string().trim().required(),
  faculty_id: yup.string().required('faculty is a required field'),
  study_program_id: yup.string().required('study program is a required field'),
});
const CreateUserLecturerForm: React.FunctionComponent<
  ICreateUserLecturerFormProps
> = ({ isOpen, onClose }) => {
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
    setValue,
    watch,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<CreateLecturerForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      user_type: 'lecturer',
      nidn: '',
      faculty_id: '',
      study_program_id: '',
    },
  });
  const {
    mutate,
    error,
    isLoading: isLoadingCreate,
  } = useMutation({
    mutationFn: async (data: CreateLecturerForm) => {
      const res = await client.post(api.users, data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'lecturer'] });
      toast({
        title: 'Create account lecturer success',
        status: 'success',
      });
      reset();
      onClose();
    },
  });

  const faculty_id = watch('faculty_id');

  React.useEffect(() => {
    setValue('study_program_id', '');
  }, [faculty_id, setValue]);

  const { data: studyprograms } = useQuery<Response<[StudyProgram]>>({
    queryKey: ['studyprograms', faculty_id],
    queryFn: async () => {
      const res = await client.get(
        api.studyprograms + convertToQueryStr({ faculty_id })
      );
      return res.data;
    },
  });

  const { data: facultys } = useQuery<Response<[User]>>({
    queryKey: ['facultys'],
    queryFn: async () => {
      const res = await client.get(api.users + '?user_type=faculty&limit=999');
      return res.data;
    },
  });

  const onSubmit = (data: CreateLecturerForm) => mutate(data);
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
          <ModalHeader>Create Account Lecturer</ModalHeader>
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
                      Create account lecturer failed!
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
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input {...register('email')} placeholder="Email" />
                {!errors.email ? (
                  <FormHelperText>
                    Random password will be sent to this email.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.nidn}>
                <FormLabel>NIDN</FormLabel>
                <Input {...register('nidn')} placeholder="NIDN" />
                <FormErrorMessage>{errors.nidn?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.faculty_id}>
                <FormLabel>Faculty</FormLabel>
                <Select {...register('faculty_id')} placeholder="Faculty">
                  {facultys?.data?.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.faculty_id?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.study_program_id}>
                <FormLabel>Study Program</FormLabel>
                <Select
                  disabled={!faculty_id}
                  {...register('study_program_id')}
                  placeholder="Study Program"
                >
                  {studyprograms?.data?.map((studyprogram) => (
                    <option key={studyprogram.id} value={studyprogram.id}>
                      {studyprogram.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.study_program_id?.message}
                </FormErrorMessage>
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
          <AlertDialogHeader>Discard account lecturer?</AlertDialogHeader>
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

export default CreateUserLecturerForm;
