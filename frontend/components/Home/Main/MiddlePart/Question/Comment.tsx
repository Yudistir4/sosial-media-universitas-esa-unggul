import * as React from 'react';

import { api } from '@/config';
import { client } from '@/services';
import { useAuth } from '@/store/user';
import { CommentDoc, ErrorResponse, PostDoc, Response } from '@/typing';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Badge,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { MdOutlineDelete } from 'react-icons/md';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as yup from 'yup';
import Link from 'next/link';
interface ICommentProps {
  post: PostDoc;
}
const validationSchema = yup.object().shape({
  comment: yup.string().required(''),
});

interface Comment {
  comment: string;
}
const Comments: React.FunctionComponent<ICommentProps> = ({ post }) => {
  const [showFormComment, setShowFormComment] = React.useState(false);
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);
  const toast = useToast();
  const { handleSubmit, register, reset } = useForm<Comment>({
    resolver: yupResolver(validationSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async (comment: Comment) => {
      const res = await client.post(
        `${api.posts}/${post.id}/comments`,
        comment
      );
      return res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Add answer failed',
        description: err.response?.data.error.message,
        status: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const onSubmit = (data: Comment) => {
    mutate(data);
    reset();
  };
  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<Response<[CommentDoc]>, AxiosError<Response>>({
    queryKey: ['comments', post.id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.get(
        `${api.posts}/${post.id}/comments?page=${pageParam}&limit=10`
      );
      return res.data;
    },
    getNextPageParam: (last: Response<[CommentDoc]>, pages) => {
      if (last.data == null) {
        return false;
      }
      return pages.length + 1;
    },
  });
  let itemLength = 0;
  comments?.pages.map((page) => {
    if (page.data) {
      itemLength += page.data.length;
    }
  });
  const [commentID, setCommentID] = React.useState('');

  const { mutate: deleteComment, isLoading } = useMutation({
    mutationFn: async (commentID: string) => {
      const res = await client.delete(
        api.posts + '/' + post.id + '/comments/' + commentID
      );
      res.data;
    },
    onSuccess: () => {
      toast({ title: 'Delete answer success', status: 'success' });
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
      onClose();
    },
  });

  let comment: CommentDoc | null = null;
  // comments?.pages.map((page) =>
  //   page.data?.map((c) => c.user.id === post.to_user.id)

  // )[0];
  if (comments) {
    for (let i = 0; i < comments.pages.length; i++) {
      for (let j = 0; j < comments.pages[i].data?.length; j++) {
        if (comments.pages[i].data[j].user.id === post.to_user.id) {
          comment = comments.pages[i].data[j];
          break;
        }
      }
    }
  }

  if (!showFormComment && comment !== null)
    return (
      <Flex className="px-3">
        <div className="w-[3px] mx-5  bg-gray-500"></div>
        <div
          className="overflow-y-auto max-h-[300px] w-full "
          id={'comments' + post.id}
        >
          <Flex
            className="justify-between items-center w-full"
            key={comment.id}
          >
            <Flex className="flex-col gap-2 max-w-[calc(100%-100px)]">
              <Flex className="gap-2 items-center">
                <Link href={`/?user_id=${comment.user.id}`}>
                  <Avatar size="xs" src={comment.user.profile_pic_url} />
                </Link>
                <Flex className="flex-col w-full">
                  <Flex className="gap-2 items-center">
                    {/* <Link href={`/?user_id=${comment.user.id}`}>
                <Text className="font-semibold">{comment.user.name}</Text>
              </Link> */}
                    <Badge
                      variant="solid"
                      borderRadius="full"
                      colorScheme={'blue'}
                    >
                      answerer
                    </Badge>
                    <Text className="text-sm font-light">
                      {moment(comment.created_at).fromNow(true)}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Text className="">{comment.comment}</Text>
            </Flex>
            {user?.id === comment.user.id && (
              <IconButton
                onClick={() => {
                  onOpen();
                  comment && setCommentID(comment.id);
                }}
                size="sm"
                className="mr-2"
                borderRadius={999}
                colorScheme="red"
                aria-label="Delete answer"
                icon={<MdOutlineDelete className="text-xl" />}
              />
            )}
          </Flex>
          <Flex className="gap-2 mt-2">
            {post.total_comments > 1 && (
              <Button
                className="cursor-pointer font-light text-sm"
                variant="outline"
                size="xs"
                borderRadius="full"
                onClick={() => setShowFormComment(true)}
              >
                {post.total_comments - 1} more answers
              </Button>
            )}
            <Button
              className="cursor-pointer font-light text-sm"
              variant="outline"
              size="xs"
              borderRadius="full"
              onClick={() => setShowFormComment(true)}
            >
              Write your answer
            </Button>
          </Flex>
        </div>
      </Flex>
    );
  return (
    <Flex className="flex-col gap-3 px-4 w-full">
      {showFormComment ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-2  items-start mt-2"
        >
          <Avatar height="40px" width="40px" src={user?.profile_pic_url} />
          <FormControl>
            <Input
              size="md"
              type="text"
              placeholder="write your answer..."
              borderRadius={999}
              {...register('comment')}
            />
          </FormControl>
        </form>
      ) : (
        <Flex className="gap-2">
          {post.total_comments > 0 && (
            <Button
              className="cursor-pointer font-light text-sm"
              variant="outline"
              size="xs"
              borderRadius="full"
              onClick={() => setShowFormComment(true)}
            >
              {post.total_comments} answer
            </Button>
          )}
          <Button
            className="cursor-pointer font-light text-sm"
            variant="outline"
            size="xs"
            borderRadius="full"
            onClick={() => setShowFormComment(true)}
          >
            Write your answer
          </Button>
        </Flex>
      )}

      {/* comments */}
      {showFormComment && (
        <div
          className="overflow-y-auto max-h-[300px] w-full"
          id={'comments' + post.id}
        >
          <InfiniteScroll
            scrollableTarget={'comments' + post.id}
            className="flex flex-col gap-5 w-full"
            dataLength={itemLength} //This is important field to render the next data
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4>Loading...</h4>}
          >
            {comments?.pages.map((page) => {
              return page.data?.map((comment) => (
                <Flex
                  className="justify-between items-center w-full"
                  key={comment.id}
                >
                  <Flex className="gap-2 max-w-[calc(100%-100px)]">
                    <Link href={`/?user_id=${comment.user.id}`}>
                      <Avatar
                        height="40px"
                        width="40px"
                        src={comment.user.profile_pic_url}
                      />
                    </Link>

                    <Flex className="flex-col w-full">
                      <Flex className="gap-2 items-center">
                        <Link href={`/?user_id=${comment.user.id}`}>
                          <Text className="font-semibold">
                            {comment.user.name}
                          </Text>
                        </Link>
                        {post.to_user.id === comment.user.id && (
                          <Badge
                            variant="solid"
                            borderRadius="full"
                            colorScheme={'blue'}
                          >
                            answerer
                          </Badge>
                        )}
                        <Text className="text-sm font-light">
                          {moment(comment.created_at).fromNow(true)}
                        </Text>
                      </Flex>
                      <Text className=" ">{comment.comment}</Text>
                    </Flex>
                  </Flex>
                  {user?.id === comment.user.id && (
                    <IconButton
                      onClick={() => {
                        onOpen();
                        setCommentID(comment.id);
                      }}
                      size="sm"
                      className="mr-2"
                      borderRadius={999}
                      colorScheme="red"
                      aria-label="Delete comment"
                      icon={<MdOutlineDelete className="text-xl" />}
                    />
                  )}
                </Flex>
              ));
            })}
          </InfiniteScroll>
        </div>
      )}

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={isLoading ? () => {} : onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete Answer</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete this answer?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button
              onClick={() => deleteComment(commentID)}
              isLoading={isLoading}
              colorScheme="red"
              ml={3}
            >
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
};

export default Comments;

// const Comment = ({ comment }: { comment: CommentDoc }) => {
//   return (
//     <Flex className="justify-between items-center w-full" key={comment.id}>
//       <Flex className="flex-col gap-2 max-w-[calc(100%-100px)]">
//         <Flex className="gap-2">
//           <Link href={`/?user_id=${comment.user.id}`}>
//             <Avatar size="xs" src={comment.user.profile_pic_url} />
//           </Link>
//           <Flex className="flex-col w-full">
//             <Flex className="gap-2 items-center">
//               {/* <Link href={`/?user_id=${comment.user.id}`}>
//                 <Text className="font-semibold">{comment.user.name}</Text>
//               </Link> */}
//               <Badge variant="solid" borderRadius="full" colorScheme={'blue'}>
//                 answerer
//               </Badge>
//               <Text>{moment(comment.created_at).fromNow(true)}</Text>
//             </Flex>
//           </Flex>
//         </Flex>
//         <Text className="">{comment.comment}</Text>
//       </Flex>
//       {user?.id === comment.user.id && (
//         <IconButton
//           onClick={() => {
//             onOpen();
//             setCommentID(comment.id);
//           }}
//           size="sm"
//           className="mr-2"
//           borderRadius={999}
//           colorScheme="red"
//           aria-label="Delete comment"
//           icon={<MdOutlineDelete className="text-xl" />}
//         />
//       )}
//     </Flex>
//   );
// };
