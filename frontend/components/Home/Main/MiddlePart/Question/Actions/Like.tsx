import { api, config } from '@/config';
import { client } from '@/services';
import { ErrorResponse, PostDoc } from '@/typing';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import * as React from 'react';
import {
  AiFillHeart,
  AiFillLike,
  AiOutlineHeart,
  AiOutlineLike,
  AiOutlineLink,
} from 'react-icons/ai';
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';
import { FaRegComment } from 'react-icons/fa';
import { TbShare3 } from 'react-icons/tb';
interface ILikeProps {
  post: PostDoc;
}

const Like: React.FunctionComponent<ILikeProps> = ({ post }) => {
  const [isLiked, setIsLiked] = React.useState(post.is_liked);
  const [totalLikes, setTotalLikes] = React.useState(post.total_likes);
  const allowActions = React.useRef(true);
  const toast = useToast();
  const { mutate: likePost } = useMutation({
    mutationFn: async () => {
      const res = await client.post(api.posts + '/' + post.id + '/like');
      res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      if (
        err.response?.data.error.message === 'The post has already been liked.'
      )
        return;

      cancelLike();
      toast({
        title: 'Like post failed',
        description: err.response?.data.error.message,
        status: 'error',
      });
    },
  });
  // unlike
  const { mutate: unlikePost } = useMutation({
    mutationFn: async () => {
      const res = await client.delete(api.posts + '/' + post.id + '/like');
      res.data;
    },
  });
  const handleLike = () => {
    allowActions.current = false;
    setIsLiked((prev) => !prev);
    if (isLiked) {
      setTotalLikes((prev) => prev - 1);
    } else {
      setTotalLikes((prev) => prev + 1);
    }
  };
  const cancelLike = () => {
    setIsLiked(false);
    setTotalLikes((prev) => prev - 1);
  };

  React.useEffect(() => {
    if (allowActions.current) return;
    const timeout = setTimeout(() => {
      if (isLiked) {
        likePost();
      } else {
        unlikePost();
      }
      allowActions.current = true;
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLiked, likePost, unlikePost]);
  return (
    <Button
      size="sm"
      rounded="full"
      variant="outline"
      borderWidth="2px"
      onClick={handleLike}
      rightIcon={
        isLiked ? (
          <AiFillLike className="text-lg" />
        ) : (
          <AiOutlineLike className="text-lg" />
        )
      }
    >
      {totalLikes}
    </Button>
  );
};

export default Like;
