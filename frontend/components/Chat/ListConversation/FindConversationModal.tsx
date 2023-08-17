import { api } from '@/config';
import useConversation from '@/store/conversation';
import {
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import UserItem from './UserItem';
import { Response, User } from '@/typing';
import { useAuth } from '@/store/user';
import { client, convertToQueryStr } from '@/services';
import { AxiosError } from 'axios';

interface IFindConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FindConversationModal: React.FunctionComponent<
  IFindConversationModalProps
> = ({ isOpen, onClose }) => {
  const bg = useColorModeValue('white', '#2d2d2d');

  const loggedInUser = useAuth((state) => state.user);
  const [query, setQuery] = useState('');

  // get Users
  const { data: users, refetch } = useQuery<
    Response<[User]>,
    AxiosError<Response>
  >({
    enabled: false,
    queryKey: ['users-search', query],
    queryFn: async () => {
      const res = await client.get(
        `${api.users}${convertToQueryStr({
          query,
          limit: 5,
        })}`
      );
      return res.data;
    },
  });

  // Create Conversation
  const { mutate: mutateCreateConversation } = useMutation({
    mutationFn: (user_ids: string[]) =>
      client.post(api.conversations, { user_ids }),
    onSuccess: async (res) => {
      await setCurrentConversationAsync(res.data.data);
    },
  });

  const setCurrentConversationAsync = useConversation(
    (state) => state.setCurrentConversationAsync
  );

  if (!loggedInUser) return <></>;

  const onClickUserItem = async (user: User) => {
    mutateCreateConversation([user.id]);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={bg} mx={4}>
          <ModalHeader>Find or start conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" gap={1} mt={1}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!query) return;
                  refetch();
                }}
              >
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, NIM or NIDN"
                />
              </form>
              {users?.data?.map((user: User) => {
                if (user.id === loggedInUser.id) return;
                return (
                  <UserItem
                    key={user.id}
                    user={user}
                    onClick={() => onClickUserItem(user)}
                  />
                );
              })}
            </Flex>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FindConversationModal;
