import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Image as ImageComponent,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { api } from '@/config';
import { client } from '@/services';
import { useCreatePostModal } from '@/store/createPostModal';
import { useAuth } from '@/store/user';
import { useVideoSetting } from '@/store/videoSetting';
import { ErrorResponse } from '@/typing';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { FaPhotoVideo } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import * as yup from 'yup';

interface ICreatePostProps {}

interface CreatePostForm {
  caption: string;
  post_category: string;
  content_file: File | null;
}

const SUPPORTED_IMAGE_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];
const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/mov', 'video/avi'];

const fileSchema = yup
  .mixed()
  .test('fileType', 'Invalid file format', (value: any | File): boolean => {
    console.log(value);
    if (!value) return true; // Allow empty file field

    const fileType = value.type;
    return (
      SUPPORTED_IMAGE_FORMATS.includes(fileType) ||
      SUPPORTED_VIDEO_FORMATS.includes(fileType)
    );
  });

const validationSchema = yup.object().shape({
  caption: yup.string().required(''),
  // content_file: fileSchema,
});

function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  };
  const divisor = gcd(width, height);
  const aspectRatio = `${width / divisor}/${height / divisor}`;
  return aspectRatio;
}

const CreatePost: React.FunctionComponent<ICreatePostProps> = (props) => {
  const user = useAuth((state) => state.user);
  const [file, setFile] = React.useState<File | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const cancelRef = React.useRef<any>();
  const { isOpen, onClose } = useCreatePostModal((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));
  const {
    isOpen: isOpenAlert,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: CreatePostForm) => {
      const formData = new FormData();

      data.content_file && formData.append('content_file', data.content_file);
      formData.append('caption', data.caption);
      formData.append('post_category', data.post_category);

      const res = await client.post(api.posts, formData);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Create post failed',
        description: err.response?.data.error.message,
        status: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      reset();
      setFile(null);
      onClose();
    },
  });
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { dirtyFields, errors },
  } = useForm<CreatePostForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      caption: '',
      content_file: null,
      post_category: '',
    },
  });

  const isFormEmpty = Object.keys(dirtyFields).length === 0;
  const onSubmit = (data: CreatePostForm) => {
    mutate(data);
  };

  // const regis = register('content_file');
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      ![...SUPPORTED_VIDEO_FORMATS, ...SUPPORTED_IMAGE_FORMATS].includes(
        file?.type
      )
    )
      return;

    if (file) {
      setValue('content_file', file);
      setFile(file);
    }
  };

  return (
    <>
      <Modal
        onClose={isFormEmpty ? onClose : openAlert}
        isOpen={isOpen}
        isCentered
        size={file ? '3xl' : 'md'}
      >
        <ModalOverlay />
        <ModalContent width="100%" mx={2} className="overflow-hidden">
          <ModalHeader className="text-center">Create Post</ModalHeader>

          <Flex className="">
            {file && (
              <Box
                display={{ sm: 'none', md: 'block' }}
                className="w-1/2 relative"
              >
                <IconButton
                  size="lg"
                  className="z-10 cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  position="absolute"
                  onClick={() => {
                    setValue('content_file', null);
                    setFile(null);
                  }}
                  borderRadius={999}
                  aria-label="input file"
                  colorScheme="red"
                  icon={<MdOutlineDelete className="text-xl" />}
                />

                {file && SUPPORTED_IMAGE_FORMATS.includes(file.type) && (
                  <ImageComponent
                    display={{ sm: 'none', md: 'block' }}
                    src={URL.createObjectURL(file)}
                    className="object-cover"
                    alt="create post image"
                  />
                )}
                {file && SUPPORTED_VIDEO_FORMATS.includes(file.type) && (
                  <video src={URL.createObjectURL(file)} controls></video>
                )}
              </Box>
            )}

            <ModalBody>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <Flex className="gap-2">
                  <Avatar src={user?.profile_pic_url} size="sm" />

                  <FormControl isInvalid={!!errors.caption}>
                    <Textarea
                      {...register('caption')}
                      rows={3}
                      placeholder="Caption"
                    />
                    <FormErrorMessage>
                      {errors.caption && errors.caption?.message}
                    </FormErrorMessage>
                  </FormControl>

                  {file && SUPPORTED_IMAGE_FORMATS.includes(file.type) && (
                    <ImageComponent
                      display={{ sm: 'block', md: 'none' }}
                      src={file ? URL.createObjectURL(file) : ''}
                      className="object-cover"
                      height={82}
                      width={82}
                      alt="create post image"
                    />
                  )}
                  {file && SUPPORTED_VIDEO_FORMATS.includes(file.type) && (
                    <Box display={{ sm: 'block', md: 'none' }}>
                      <video
                        className="w-[82px] h-[82px] object-cover"
                        src={URL.createObjectURL(file)}
                      ></video>
                    </Box>
                  )}

                  <IconButton
                    display={file ? 'none' : 'flex'}
                    as="label"
                    htmlFor="file"
                    size="md"
                    className="cursor-pointer"
                    aria-label="input file"
                    icon={<FaPhotoVideo className="text-xl" />}
                  />
                  <input
                    className="hidden"
                    type="file"
                    {...register('content_file')}
                    onChange={handleFileChange}
                    id="file"
                  />
                </Flex>

                <Select
                  placeholder="Category (Optional)"
                  {...register('post_category')}
                >
                  <option value="seminar">Seminar</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="competition">Competition</option>
                  <option value="internship">Internship</option>
                </Select>

                {/* {!!errors.content_file && (
                <Alert status="error">
                  <AlertIcon />
                  {errors.content_file?.message}
                </Alert>
              )} */}

                {/* Button */}
                <Button isLoading={isLoading} colorScheme="blue" type="submit">
                  Submit
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

        <AlertDialogContent>
          <AlertDialogHeader>Discard post?</AlertDialogHeader>
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
                setFile(null);
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

export default CreatePost;
