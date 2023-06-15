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
  Avatar,
  AvatarBadge,
  Button,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
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
import { ErrorResponse, Response, User } from '@/typing';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { BsFillCameraFill } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { AiOutlinePicture } from 'react-icons/ai';
interface IUpdateProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}
interface UpdateOrganizationForm {
  id: string;
  bio: string;
  eksternal_link: string;
  instagram: string;
  linkedin: string;
  whatsapp: string;
}
const SUPPORTED_IMAGE_FORMATS = ['image/png', 'image/jpg', 'image/jpeg'];

const validationSchema = yup.object().shape({
  bio: yup.string().trim(),
  eksternal_link: yup.string().url(),
  instagram: yup.string().trim(),
  linkedin: yup
    .string()
    .url()
    .matches(/linkedin\.com/, {
      message: 'URL must contain "linkedin.com"',
      excludeEmptyString: true,
    }),
  whatsapp: yup.string().matches(/^[1-9]\d{1,14}$/, {
    message: 'Invalid WhatsApp number',
    excludeEmptyString: true,
  }),
});
const UpdateProfile: React.FunctionComponent<IUpdateProfileProps> = ({
  isOpen,
  onClose,
  user,
}) => {
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
  } = useForm<UpdateOrganizationForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      id: user.id,
      bio: user.bio,
      eksternal_link: user.eksternal_link,
      instagram: user.instagram,
      linkedin: user.linkedin,
      whatsapp: user.whatsapp,
    },
  });
  const {
    mutate,
    error,
    isLoading: isLoadingUpdate,
  } = useMutation({
    mutationFn: async (data: UpdateOrganizationForm) => {
      const res = await client.put(
        api.users + '/' + user.id + '/profile',
        data
      );
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [user.id] });
      toast({
        title: 'Update profile success',
        status: 'success',
      });
      reset();
      onClose();
    },
  });
  const { mutate: uploadProfilePic, isLoading: isLoadingUpdateProfilePic } =
    useMutation({
      mutationFn: async (profile_pic: File) => {
        const formData = new FormData();
        formData.append('profile_pic', profile_pic);
        const res = await client.put(
          api.users + '/' + user.id + '/profile-pic',
          formData
        );
        return res.data;
      },
      onError: (err: AxiosError<ErrorResponse>) => {},
      onSuccess: (data: Response<{ profile_pic_url: string }>) => {
        console.log(data.data.profile_pic_url);
        queryClient.invalidateQueries({ queryKey: [user.id] });
        toast({
          title: 'Update profile pic success',
          status: 'success',
        });
      },
    });
  const { mutate: deleteProfilePic, isLoading: isLoadingDeleteProfilePic } =
    useMutation({
      mutationFn: async () => {
        const res = await client.delete(
          api.users + '/' + user.id + '/profile-pic'
        );
        return res.data;
      },
      onError: (err: AxiosError<ErrorResponse>) => {},
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [user.id] });
        toast({
          title: 'Delete profile pic success',
          status: 'success',
        });
      },
    });
  const onSubmit = (data: UpdateOrganizationForm) => mutate(data);
  const isFormEmpty = Object.keys(dirtyFields).length === 0;
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!SUPPORTED_IMAGE_FORMATS.includes(file?.type)) {
      toast({
        title: 'Unsupported file format',
        status: 'error',
      });
      return;
    }

    if (file) {
      uploadProfilePic(file);
    }
  };
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
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col ">
            <form action="" className="mb-4 self-center relative">
              <input
                className="hidden"
                type="file"
                onChange={handleFileChange}
                id="profile-pic"
              />
              <Avatar src={user.profile_pic_url} size="2xl" />

              <Popover placement="right">
                <PopoverTrigger>
                  <IconButton
                    className="right-0 bottom-0"
                    position="absolute"
                    borderRadius={999}
                    colorScheme="blue"
                    aria-label="link"
                    icon={<BsFillCameraFill className="text-xl" />}
                  />
                </PopoverTrigger>
                <PopoverContent width="full" borderRadius={999}>
                  <PopoverArrow />
                  <PopoverBody className="flex flex-col gap-2">
                    <IconButton
                      isLoading={isLoadingUpdateProfilePic}
                      isDisabled={isLoadingDeleteProfilePic}
                      as="label"
                      className="cursor-pointer"
                      htmlFor="profile-pic"
                      borderRadius={999}
                      colorScheme="blue"
                      aria-label="link"
                      icon={<AiOutlinePicture className="text-xl" />}
                    />
                    <IconButton
                      onClick={() => deleteProfilePic()}
                      isLoading={isLoadingDeleteProfilePic}
                      isDisabled={
                        user.profile_pic_url === '' || isLoadingUpdateProfilePic
                      }
                      borderRadius={999}
                      colorScheme="red"
                      aria-label="link"
                      icon={<MdOutlineDelete className="text-xl" />}
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </form>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {error && (
                <Alert status="error" className="items-center">
                  <AlertIcon />
                  <Flex className="flex-wrap">
                    <AlertTitle className="shrink-0">
                      Update profile failed!
                    </AlertTitle>
                    <AlertDescription className="shrink-0">
                      {error?.response?.data.error.message}
                    </AlertDescription>
                  </Flex>
                </Alert>
              )}
              <FormControl isInvalid={!!errors.bio}>
                <FormLabel>Bio</FormLabel>
                <Input {...register('bio')} placeholder="Bio" />
                <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.eksternal_link}>
                <FormLabel>Eksternal link</FormLabel>
                <Input
                  {...register('eksternal_link')}
                  placeholder="Eksternal link"
                />
                <FormErrorMessage>
                  {errors.eksternal_link?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.instagram}>
                <FormLabel>Instagram username</FormLabel>
                <Input
                  {...register('instagram')}
                  placeholder="Instagram username without @"
                />
                <FormErrorMessage>{errors.instagram?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.linkedin}>
                <FormLabel>Linkedin URL</FormLabel>
                <Input {...register('linkedin')} placeholder="Linkedin URL" />
                <FormErrorMessage>{errors.linkedin?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.whatsapp}>
                <FormLabel>Whatsapp</FormLabel>
                <InputGroup>
                  <InputLeftAddon>+62</InputLeftAddon>
                  <Input {...register('whatsapp')} placeholder="Whatsapp" />
                </InputGroup>
                <FormErrorMessage>{errors.whatsapp?.message}</FormErrorMessage>
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

export default UpdateProfile;
