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
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
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

import { useEditPostModal } from '@/store/editPostModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface IUpdatePostProps {}
interface UpdatePostForm {
  id: string;
  caption: string;
}
const validationSchema = yup.object().shape({
  caption: yup.string().trim().required('Caption is a required field'),
});
const UpdatePost: React.FunctionComponent<IUpdatePostProps> = ({}) => {
  const toast = useToast();
  const { isOpen, post, onClose } = useEditPostModal((state) => ({
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
  } = useForm<UpdatePostForm>({
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
    mutationFn: async (data: UpdatePostForm) => {
      const res = await client.put(api.posts + '/' + post?.id, data);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Update post success',
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

  const onSubmit = (data: UpdatePostForm) => mutate(data);
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
        size={post?.content_file_url ? '3xl' : 'md'}
      >
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader textAlign="center">Edit Post</ModalHeader>
          <ModalCloseButton />

          <Flex>
            {post?.content_file_url && (
              <Box
                display={{ sm: 'none', md: 'block' }}
                className="w-1/2 relative"
              >
                {post.content_type === 'image' && (
                  <Image
                    display={{ sm: 'none', md: 'block' }}
                    src={post.content_file_url}
                    className="object-cover"
                    alt="create post image"
                  />
                )}
                {post.content_type === 'video' && (
                  <video src={post.content_file_url} controls></video>
                )}
              </Box>
            )}
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
                        Update post failed!
                      </AlertTitle>
                      <AlertDescription className="shrink-0">
                        {error?.response?.data.error.message}
                      </AlertDescription>
                    </Flex>
                  </Alert>
                )}
                <FormControl isInvalid={!!errors.caption}>
                  <FormLabel>Caption</FormLabel>
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
          </Flex>
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

export default UpdatePost;
