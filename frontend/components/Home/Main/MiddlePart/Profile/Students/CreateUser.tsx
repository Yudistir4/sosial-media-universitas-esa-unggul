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
interface ICreateUserStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
}
interface CreateStudentForm {
  name: string;
  email: string;
  user_type: string;
  nim: string;
  year: number | undefined;
  is_graduated: boolean;
  faculty_id: string;
  study_program_id: string;
}
const validationSchema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().trim().email().required(),
  user_type: yup.string().required(),
  nim: yup.string().trim().required(),
  is_graduated: yup.boolean(),
  year: yup
    .number()
    .required('Batch is required field')
    .typeError('batch must be a number'),
  faculty_id: yup.string().required('faculty is a required field'),
  study_program_id: yup.string().required('study program is a required field'),
});
const CreateUserStudentForm: React.FunctionComponent<
  ICreateUserStudentFormProps
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
  } = useForm<CreateStudentForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      user_type: 'student',
      nim: '',
      year: undefined,
      is_graduated: false,
      faculty_id: '',
      study_program_id: '',
    },
  });
  const {
    mutate,
    error,
    isLoading: isLoadingCreate,
  } = useMutation({
    mutationFn: async (data: CreateStudentForm) => {
      // if (data.is_graduated == 'true') {
      //   data.is_graduated = true;
      // }
      const res = await client.post(api.users, data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'student'] });
      toast({
        title: 'Create account student success',
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

  const onSubmit = (data: CreateStudentForm) => mutate(data);
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
          <ModalHeader>Create Account Student</ModalHeader>
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
                      Create account student failed!
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
              <FormControl isInvalid={!!errors.nim}>
                <FormLabel>NIM</FormLabel>
                <Input {...register('nim')} placeholder="NIM" />
                <FormErrorMessage>{errors.nim?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.year}>
                <FormLabel>Batch</FormLabel>
                <Input {...register('year')} placeholder="Batch" />
                <FormErrorMessage>{errors.year?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.is_graduated}>
                <FormLabel>Is Graduated</FormLabel>
                <Select
                  {...register('is_graduated')}

                  // placeholder="Is Graduated"
                >
                  <option value={'false'}>No</option>
                  <option value={'true'}>Yes</option>
                </Select>
                <FormErrorMessage>
                  {errors.is_graduated?.message}
                </FormErrorMessage>
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
          <AlertDialogHeader>Discard account student?</AlertDialogHeader>
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

export default CreateUserStudentForm;
