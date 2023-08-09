import { api } from '@/config';
import { client } from '@/services';
import { ErrorResponse, User } from '@/typing';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';

interface IDeleteUserProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUser: React.FunctionComponent<IDeleteUserProps> = ({
  user,
  onClose,
  isOpen,
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { mutate: deleteUser, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await client.delete(api.users + '/' + user.id);
      res.data;
    },
    onSuccess: () => {
      toast({ title: 'Delete user student success', colorScheme: 'green' });
      queryClient.invalidateQueries({ queryKey: ['users', 'student'] });
      onClose();
    },
    onError: (res: AxiosError<ErrorResponse>) => {
      console.log(res.response?.data.error.message);
      toast({
        title: 'Delete user student failed',
        description: res.response?.data.error.message,
        colorScheme: 'red',
      });
    },
  });
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={isLoading ? () => {} : onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent mx={2}>
        <AlertDialogHeader>Delete Account</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you sure you want to delete this user?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button
            onClick={() => deleteUser()}
            isLoading={isLoading}
            colorScheme="red"
            ml={3}
          >
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUser;
