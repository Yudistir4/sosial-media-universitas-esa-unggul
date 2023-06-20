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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { api } from '@/config';
import { client } from '@/services';
import { ErrorResponse } from '@/typing';

import { useEditQuestionModal } from '@/store/editQuestionModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
interface IUpdateQuestionProps {}
interface UpdateQuestionForm {
  id: string;
  caption: string;
}
const validationSchema = yup.object().shape({
  caption: yup.string().trim().required('Question is a required field'),
});
const UpdateQuestion: React.FunctionComponent<IUpdateQuestionProps> = ({}) => {
  const toast = useToast();
  const { isOpen, post, onClose } = useEditQuestionModal((state) => ({
    isOpen: state.isOpen,
    post: state.post,
    onClose: state.onClose,
  }));

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
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<UpdateQuestionForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: post?.id,
      caption: post?.caption,
    },
  });
  const {
    mutate,
    error,
    isLoading: isLoadingUpdate,
  } = useMutation({
    mutationFn: async (data: UpdateQuestionForm) => {
      const res = await client.put(api.posts + '/' + post?.id, data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'question'] });
      toast({
        title: 'Update question success',
        status: 'success',
      });
      reset();
      onClose();
    },
  });
  React.useEffect(() => {
    if (!post) return;
    setValue('id', post.id);
    setValue('caption', post.caption);
  }, [post, setValue]);

  const onSubmit = (data: UpdateQuestionForm) => mutate(data);
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
          <ModalHeader>Update Question</ModalHeader>
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
                      Update question failed!
                    </AlertTitle>
                    <AlertDescription className="shrink-0">
                      {error?.response?.data.error.message}
                    </AlertDescription>
                  </Flex>
                </Alert>
              )}
              <FormControl isInvalid={!!errors.caption}>
                <FormLabel>Question</FormLabel>
                <Textarea {...register('caption')} placeholder="Caption" />
                <FormErrorMessage>{errors.caption?.message}</FormErrorMessage>
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

export default UpdateQuestion;
