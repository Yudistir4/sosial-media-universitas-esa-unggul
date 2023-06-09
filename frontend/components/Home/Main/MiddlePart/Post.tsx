import * as React from 'react';
import { Box, Flex, Avatar, Text, Image } from '@chakra-ui/react';
import { SlOptionsVertical } from 'react-icons/sl';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaRegComment, FaRegPaperPlane } from 'react-icons/fa';
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';
interface IPostProps {}

const Post: React.FunctionComponent<IPostProps> = (props) => {
  return (
    <Box bg="white" shadow="lg" className="">
      {/* Top */}
      <Flex className="justify-between items-center p-3">
        <Flex gap={2} className="">
          <Avatar />
          <Flex className="flex-col justify-center">
            <Text className="font-semibold">Fajar Nugraha</Text>
            <Text fontSize="sm">29m ago</Text>
          </Flex>
        </Flex>
        <SlOptionsVertical />
      </Flex>

      {/* File */}
      <Image
        src="https://source.unsplash.com/800x600/?nature"
        className="object-cover w-full"
        alt=""
      />
      {/* Actions */}
      <Flex className="text-2xl">
        <Flex>
          <Box className="text-[25px]">
            <AiFillHeart className="text-red-500" />
            <AiOutlineHeart className="" />
          </Box>
          <FaRegComment />
          <BsBookmark />
          <BsFillBookmarkFill />
        </Flex>
        <FaRegPaperPlane />
      </Flex>
      {/* Caption */}
      <Text className="p-2" fontSize="sm">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam eius
        harum soluta, nulla sunt tempore voluptatibus deserunt? Deleniti, error
        voluptatem.
      </Text>
    </Box>
  );
};

export default Post;
