/* eslint-disable react/no-children-prop */
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
  InputGroup,
  InputLeftAddon,
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

import { useChangeEmailModal } from '@/store/changeEmailModal';
import { useAuth } from '@/store/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineMail } from 'react-icons/ai';
import * as yup from 'yup';
import VerificationCodeForm from './VerificationCodeForm';
interface IChangeEmailProps {}
interface ChangeEmailForm {
  new_email: string;
}

const validationSchema = yup.object().shape({
  new_email: yup.string().email().required('Email is required'),
});
const ChangeEmail: React.FunctionComponent<IChangeEmailProps> = () => {
  const { isOpen, onClose } = useChangeEmailModal((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));
  const [showCodeForm, setShowCodeForm] = React.useState(false);

  const [newEmail, setNewEmail] = React.useState('');

  const toast = useToast();
  const {
    isOpen: isOpenAlert,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();

  const cancelRef = React.useRef<any>();
  const {
    handleSubmit,
    register,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<ChangeEmailForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      new_email: '',
    },
  });

  const {
    mutate,
    error,
    isLoading: isLoadingChange,
  } = useMutation({
    mutationFn: async (data: ChangeEmailForm) => {
      const res = await client.post(api.auths + '/change-email', data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      setShowCodeForm(true);
      reset();
    },
  });
  const onSubmit = (data: ChangeEmailForm) => {
    mutate(data);
    setNewEmail(data.new_email);
  };

  const isFormEmpty = Object.keys(dirtyFields).length === 0;
  const loggedInUser = useAuth((state) => state.user);
  return (
    <div>
      <Modal
        isCentered
        onClose={
          showCodeForm
            ? openAlert
            : isFormEmpty
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
          <ModalHeader className="text-center flex items-center justify-center gap-2">
            <AiOutlineMail className="text-xl" /> Change Email
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size="sm" className="mb-10">
              <InputLeftAddon children="Current email" />
              <Input placeholder="mysite" value={loggedInUser?.email} />
            </InputGroup>
            {!showCodeForm && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {error && (
                  <Alert status="error" className="items-center">
                    <AlertIcon />
                    <Flex className="flex-wrap">
                      <AlertTitle className="shrink-0">
                        Change email failed!
                      </AlertTitle>
                      <AlertDescription className="">
                        {error?.response?.data.error.message}
                      </AlertDescription>
                    </Flex>
                  </Alert>
                )}
                <FormControl isInvalid={!!errors.new_email}>
                  <FormLabel textAlign="center">New Email</FormLabel>
                  <Input {...register('new_email')} placeholder="New email" />
                  <FormErrorMessage justifyContent="center">
                    {errors.new_email?.message}
                  </FormErrorMessage>
                </FormControl>

                <Button
                  isLoading={isLoadingChange}
                  colorScheme="blue"
                  type="submit"
                  mb={2}
                >
                  Submit
                </Button>
              </form>
            )}

            {showCodeForm && (
              <VerificationCodeForm
                closeCodeForm={() => setShowCodeForm(false)}
                new_email={newEmail}
              />
            )}
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
                setShowCodeForm(false);
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

export default ChangeEmail;
