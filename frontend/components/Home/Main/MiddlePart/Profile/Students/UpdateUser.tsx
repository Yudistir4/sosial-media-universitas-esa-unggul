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
interface IUpdateUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}
interface UpdateStudentForm {
  id: string;
  name: string;
  email: string;
  user_type: string;
  nim: string;
  year: number | undefined;
  faculty_id: string;
  study_program_id: string;
}
const validationSchema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().trim().email().required(),
  user_type: yup.string().required(),
  nim: yup.string().trim().required(),
  year: yup.number().required().typeError('year must be a number'),
  faculty_id: yup.string().required('faculty is a required field'),
  study_program_id: yup.string().required('study program is a required field'),
});
const UpdateUser: React.FunctionComponent<IUpdateUserProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  console.log(user);
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
    watch,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<UpdateStudentForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      user_type: 'student',
      nim: user.student.nim,
      year: user.student.year,
      faculty_id: user.student.faculty.id,
      study_program_id: user.student.study_program.id,
    },
  });
  const {
    mutate,
    error,
    isLoading: isLoadingUpdate,
  } = useMutation({
    mutationFn: async (data: UpdateStudentForm) => {
      const res = await client.put(api.users + '/' + user.id, data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'student'] });
      toast({
        title: 'Update account student success',
        status: 'success',
      });
      reset();
      onClose();
    },
  });

  const faculty_id = watch('faculty_id');
  React.useEffect(() => {
    if (user.student.faculty.id === faculty_id) return;
    setValue('study_program_id', '');
  }, [faculty_id, setValue, user]);

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

  const onSubmit = (data: UpdateStudentForm) => mutate(data);
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
          <ModalHeader>Update Account student</ModalHeader>
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
                      Update account student failed!
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
                    If the email is changed, a new random password will be sent
                    to the new email.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.nim}>
                <FormLabel>Nim</FormLabel>
                <Input {...register('nim')} placeholder="Nim" />
                <FormErrorMessage>{errors.nim?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.year}>
                <FormLabel>Angkatan</FormLabel>
                <Input {...register('year')} placeholder="Angkatan" />
                <FormErrorMessage>{errors.year?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.faculty_id}>
                <FormLabel>Fakultas</FormLabel>
                <Select {...register('faculty_id')} placeholder="Fakultas">
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
                  isDisabled={!faculty_id}
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

export default UpdateUser;
