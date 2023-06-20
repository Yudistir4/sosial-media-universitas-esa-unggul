import { api, config } from '@/config';
import { client } from '@/services';
import { ErrorResponse, PostDoc } from '@/typing';
import {
  Box,
  Flex,
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
import { AiFillHeart, AiOutlineHeart, AiOutlineLink } from 'react-icons/ai';
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';
import { FaRegComment } from 'react-icons/fa';
import { TbShare3 } from 'react-icons/tb';
interface IActionsProps {
  post: PostDoc;
  toggleComment: () => void;
}

const Actions: React.FunctionComponent<IActionsProps> = ({
  post,
  toggleComment,
}) => {
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

  // Save
  const { mutate: savePost } = useMutation({
    mutationFn: async () => {
      const res = await client.post(api.posts + '/' + post.id + '/save');
      res.data;
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      if (
        err.response?.data.error.message === 'The post has already been saved.'
      )
        return;
      cancelSave();
      toast({
        title: 'Save post failed',
        description: err.response?.data.error.message,
        status: 'error',
      });
    },
  });

  const { mutate: unsavePost } = useMutation({
    mutationFn: async () => {
      const res = await client.delete(api.posts + '/' + post.id + '/save');
      res.data;
    },
  });
  const [isSaved, setIsSaved] = React.useState(post.is_saved);
  const [totalSaves, setTotalSaves] = React.useState(post.total_saves);
  const [isLiked, setIsLiked] = React.useState(post.is_liked);
  const [totalLikes, setTotalLikes] = React.useState(post.total_likes);
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
  const cancelSave = () => {
    setIsSaved(false);
    setTotalSaves((prev) => prev - 1);
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

  const handleSave = () => {
    allowActions.current = false;
    setIsSaved((prev) => !prev);
    if (isSaved) {
      setTotalSaves((prev) => prev - 1);
    } else {
      setTotalSaves((prev) => prev + 1);
    }
  };

  React.useEffect(() => {
    if (allowActions.current) return;

    const timeout = setTimeout(() => {
      if (isSaved) {
        savePost();
      } else {
        unsavePost();
      }
      allowActions.current = true;
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [isSaved, savePost, unsavePost]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${config.frontendURL}/?post_id=${post.id}`
      );
      toast({
        title: 'Link copied',
        status: 'success',
      });
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  return (
    <Flex className="flex-col gap-1">
      {/* Actions */}
      <Flex className="text-3xl justify-between px-4">
        <Flex className=" items-center gap-3">
          <Box className="text-[36px]">
            <button className="items-center  flex" onClick={handleLike}>
              {isLiked ? (
                <AiFillHeart className="text-red-500" />
              ) : (
                <AiOutlineHeart className="" />
              )}
            </button>
          </Box>
          <button onClick={toggleComment}>
            <FaRegComment />
          </button>

          <Menu>
            <MenuButton>
              <TbShare3 />
            </MenuButton>
            <Portal>
              <MenuList>
                <MenuItem
                  icon={<AiOutlineLink className="text-2xl" />}
                  onClick={copyLink}
                >
                  Copy Link
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
        <button className="flex items-center" onClick={handleSave}>
          {isSaved ? <BsFillBookmarkFill /> : <BsBookmark />}
        </button>
      </Flex>

      {/* Total like and save */}
      <Flex className="px-4 justify-between">
        {totalLikes != 0 && (
          <Text fontSize="sm" className="font-semibold">
            {totalLikes} like
          </Text>
        )}
        {totalSaves != 0 && (
          <Text fontSize="sm" className="font-semibold self-start ml-auto">
            {totalSaves} save
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default Actions;
