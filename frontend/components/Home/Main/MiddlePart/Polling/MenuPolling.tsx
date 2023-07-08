import { api } from '@/config';
import { client } from '@/services';
import { PollingDoc, QueryParams } from '@/typing';
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
import { useRouter } from 'next/router';
import * as React from 'react';
import { MdOutlineDelete, MdOutlineModeEditOutline } from 'react-icons/md';
import { SlOptionsVertical } from 'react-icons/sl';
interface IMenuPollingProps {
  polling: PollingDoc;
}

const MenuPolling: React.FunctionComponent<IMenuPollingProps> = ({
  polling,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { polling_id } = router.query as unknown as QueryParams;
  const toast = useToast();
  const { mutate: deletePolling, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await client.delete(api.pollings + '/' + polling.id);
      res.data;
    },
    onSuccess: () => {
      toast({ title: 'Delete polling success', colorScheme: 'green' });
      queryClient.invalidateQueries({ queryKey: ['pollings'] });
      polling_id && router.push('/');
      onClose();
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="absolute right-3 top-4">
      <Menu placement="bottom-end">
        <MenuButton>
          <SlOptionsVertical className="w-10 rounded-full -mr-1" />
        </MenuButton>
        <Portal>
          <MenuList>
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

        <AlertDialogContent mx={2}>
          <AlertDialogHeader>Delete Polling</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this polling?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              onClick={() => deletePolling()}
              isLoading={isLoading}
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

export default MenuPolling;
