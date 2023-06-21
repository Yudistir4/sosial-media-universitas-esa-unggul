import { api } from '@/config';
import { client } from '@/services';
import { useEditPostModal } from '@/store/editPostModal';
import { PostDoc } from '@/typing';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { MdOutlineDelete, MdOutlineModeEditOutline } from 'react-icons/md';
import { SlOptionsVertical } from 'react-icons/sl';
interface IMenuPostProps {
  post: PostDoc;
}

const MenuPost: React.FunctionComponent<IMenuPostProps> = ({ post }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const editPost = useEditPostModal((state) => state.onOpen);
  const { mutate: deletePost, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await client.delete(api.posts + '/' + post.id);
      res.data;
    },
    onSuccess: () => {
      toast({ title: 'Delete post success', colorScheme: 'green' });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onClose();
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Menu placement="bottom-end">
        <MenuButton>
          <SlOptionsVertical className="w-10 rounded-full -mr-1" />
        </MenuButton>
        <Portal>
          <MenuList>
            <MenuItem
              onClick={() => editPost(post)}
              icon={<MdOutlineModeEditOutline className="text-2xl" />}
            >
              {' '}
              Edit
            </MenuItem>
            <MenuItem
              onClick={onOpen}
              color="red.500"
              icon={<MdOutlineDelete className="text-2xl" />}
            >
              Delete
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>

      {/* Alert */}
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={isLoading ? () => {} : onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete Post</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this post?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              onClick={() => deletePost()}
              isLoading={isLoading}
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

export default MenuPost;
