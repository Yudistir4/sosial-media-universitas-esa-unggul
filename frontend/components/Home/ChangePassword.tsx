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
import { useChangePasswordModal } from '@/store/changePasswordModal';
import { RiLockPasswordLine } from 'react-icons/ri';
interface IChangePasswordProps {}
interface ChangePasswordForm {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
const validationSchema = yup.object().shape({
  old_password: yup.string().required('Current password is required'),
  new_password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('new_password'), ''], 'Passwords must match')
    .required('Confirm password is required'),
});
const ChangePassword: React.FunctionComponent<IChangePasswordProps> = () => {
  const { isOpen, onClose } = useChangePasswordModal((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));
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
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });
  const {
    mutate,
    error,
    isLoading: isLoadingChange,
  } = useMutation({
    mutationFn: async (data: ChangePasswordForm) => {
      const res = await client.put(api.auths + '/reset-password', data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'organization'] });
      toast({
        title: 'Change password success',
        status: 'success',
      });
      reset();
      onClose();
    },
  });
  const onSubmit = (data: ChangePasswordForm) => mutate(data);
  const isFormEmpty = Object.keys(dirtyFields).length === 0;

  return (
    <div>
      <Modal
        isCentered
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
          <ModalHeader className="text-center flex items-center justify-center gap-2">
            <RiLockPasswordLine className="text-xl" /> Change Password
          </ModalHeader>
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
                      Change password failed!
                    </AlertTitle>
                    <AlertDescription className="">
                      {error?.response?.data.error.message}
                    </AlertDescription>
                  </Flex>
                </Alert>
              )}
              <FormControl isInvalid={!!errors.old_password}>
                <Input
                  type="password"
                  {...register('old_password')}
                  placeholder="Current password"
                />
                <FormErrorMessage>
                  {errors.old_password?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.new_password}>
                <Input
                  type="password"
                  {...register('new_password')}
                  placeholder="New password"
                />
                <FormErrorMessage>
                  {errors.new_password?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.confirm_password}>
                <Input
                  type="password"
                  {...register('confirm_password')}
                  placeholder="Confirm password"
                />
                <FormErrorMessage>
                  {errors.confirm_password?.message}
                </FormErrorMessage>
              </FormControl>
              {/* <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input {...register('email')} placeholder="Email" />
                {!errors.email ? (
                  <FormHelperText>
                    Random password will be sent to this email.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                )}
              </FormControl> */}
              <Button
                isLoading={isLoadingChange}
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
          <AlertDialogHeader>Discard password?</AlertDialogHeader>
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

export default ChangePassword;
