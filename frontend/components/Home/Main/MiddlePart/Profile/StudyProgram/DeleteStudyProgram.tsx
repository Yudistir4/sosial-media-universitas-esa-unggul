import { api } from '@/config';
import { client } from '@/services';
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
import * as React from 'react';

interface IDeleteStudyProgramProps {
  facultyID: string;
  studyProgramID: string;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteStudyProgram: React.FunctionComponent<IDeleteStudyProgramProps> = ({
  facultyID,
  studyProgramID,
  onClose,
  isOpen,
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { mutate: deleteStudyProgram, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await client.delete(api.studyprograms + '/' + studyProgramID);
      res.data;
    },
    onSuccess: () => {
      toast({ title: 'Delete study program success', colorScheme: 'green' });
      queryClient.invalidateQueries({ queryKey: ['studyprograms', facultyID] });
      onClose();
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
        <AlertDialogHeader>Delete Study Program</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you sure you want to delete this study program?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button
            onClick={() => deleteStudyProgram()}
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

export default DeleteStudyProgram;
