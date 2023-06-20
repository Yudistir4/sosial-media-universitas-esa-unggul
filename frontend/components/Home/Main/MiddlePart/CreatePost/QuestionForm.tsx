import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { api } from '@/config';
import { client, convertToQueryStr } from '@/services';
import { ErrorResponse, Response, User } from '@/typing';

import { useAuth } from '@/store/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { AiFillCaretRight } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import { GoTriangleDown } from 'react-icons/go';
import * as yup from 'yup';
interface IQuestionFormProps {
  onClose: () => void;
  to_user: User | null | undefined;
}
interface CreateQuestionForm {
  caption: string;
  post_category: string;
  user_id: string;
  to_user_id: string | null;
}
const validationSchema = yup.object().shape({
  caption: yup.string().trim().required('Question is a required field'),
  to_user_id: yup.string().required('User is a required field'),
});

const QuestionForm: React.FunctionComponent<IQuestionFormProps> = ({
  onClose,
  to_user,
}) => {
  const [selected, setSelected] = React.useState<User | null>(null);
  const [search, setSearch] = React.useState('');
  const loggedInUser = useAuth((state) => state.user);
  const toast = useToast();
  const { onOpen, onClose: closePopover, isOpen } = useDisclosure();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateQuestionForm>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      caption: '',
      user_id: loggedInUser?.id,
      to_user_id: null,
      post_category: 'question',
    },
  });

  const { data, refetch } = useQuery<Response<[User]>, AxiosError<Response>>({
    queryKey: ['users-search', search],
    queryFn: async () => {
      const res = await client.get(
        `${api.users}${convertToQueryStr({
          query: search,
          limit: 5,
        })}`
      );
      return res.data;
    },
    enabled: false,
  });
  React.useEffect(() => {
    if (!search) return;
    const timeout = setTimeout(() => refetch(), 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [search, refetch]);
  React.useEffect(() => {
    if (!to_user) return;
    setValue('to_user_id', to_user.id);
    setSelected(to_user);
  }, [to_user, setValue]);

  const {
    mutate,
    error,
    isLoading: isLoadingCreate,
  } = useMutation({
    mutationFn: async (data: CreateQuestionForm) => {
      const formData = new FormData();
      formData.append('caption', data.caption);
      formData.append('post_category', data.post_category);
      formData.append('user_id', data.user_id);
      formData.append('to_user_id', data.to_user_id as string);
      const res = await client.post(api.posts, formData);
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'question'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Create question success',
        status: 'success',
      });
      reset();
      onClose();
    },
  });
  const onSubmit = (data: CreateQuestionForm) => mutate(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Flex className="items-center gap-2">
        <Avatar size="sm" src={loggedInUser?.profile_pic_url} />
        <AiFillCaretRight />

        <div className="relative ">
          <Popover isOpen={isOpen} onOpen={onOpen} onClose={closePopover}>
            <PopoverTrigger>
              <Button
                justifyContent="flex-start"
                bg="transparent"
                variant="outline"
                colorScheme={
                  selected ? 'gray' : errors.to_user_id ? 'red' : 'gray'
                }
                borderRadius={'full'}
                leftIcon={
                  selected ? (
                    <Avatar size={'sm'} src={selected.profile_pic_url} />
                  ) : (
                    <BsFillPeopleFill className="w-8" />
                  )
                }
                rightIcon={<GoTriangleDown />}
              >
                {selected ? selected.name : 'Select User'}
              </Button>
            </PopoverTrigger>
            <FormErrorMessage>{errors.to_user_id?.message}</FormErrorMessage>
            <PopoverContent width="280px">
              <PopoverArrow />

              <PopoverBody p={0} className="flex flex-col ">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="m-auto my-2"
                  width="90%"
                  placeholder="Search users..."
                />

                {data?.data?.map((user) => {
                  if (user.id === loggedInUser?.id) return;
                  return (
                    <Button
                      key={user.id}
                      onClick={() => {
                        setSelected(user);
                        setValue('to_user_id', user.id);
                        setSearch('');
                        closePopover();
                      }}
                      justifyContent="flex-start"
                      bg="transparent"
                      borderRadius={0}
                      leftIcon={<Avatar size="sm" src={user.profile_pic_url} />}
                    >
                      <Text noOfLines={1}>{user.name}</Text>
                    </Button>
                  );
                })}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
      </Flex>
      {error && (
        <Alert status="error" className="items-center">
          <AlertIcon />
          <Flex className="flex-wrap">
            <AlertTitle className="shrink-0">
              Create question failed!
            </AlertTitle>
            <AlertDescription className="shrink-0">
              {error?.response?.data.error.message}
            </AlertDescription>
          </Flex>
        </Alert>
      )}
      <FormControl isInvalid={!!errors.caption}>
        <Textarea
          {...register('caption')}
          placeholder="write your question..."
        />
        <FormErrorMessage>{errors.caption?.message}</FormErrorMessage>
      </FormControl>

      <Button
        isLoading={isLoadingCreate}
        colorScheme="blue"
        type="submit"
        mb={2}
      >
        Submit
      </Button>
    </form>
  );
};

export default QuestionForm;
