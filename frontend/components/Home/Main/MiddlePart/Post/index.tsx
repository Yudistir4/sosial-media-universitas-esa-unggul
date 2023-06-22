import { useCreatePostModal } from '@/store/createPostModal';
import { useAuth } from '@/store/user';
import { useVideoSetting } from '@/store/videoSetting';
import { PostDoc } from '@/typing';
import { Flex, Image, Text } from '@chakra-ui/react';
import * as React from 'react';
import Actions from './Actions';
import Caption from './Caption';
import Comment from './Comment';
import MenuPost from './MenuPost';
import User from './User';
import { useRouter } from 'next/router';
interface IPostProps {
  post: PostDoc;
  caption?: string;
  isSearchMode?: boolean;
  customCallback?: () => void;
}

const Post: React.FunctionComponent<IPostProps> = ({
  post,
  caption,
  isSearchMode,
  customCallback,
}) => {
  const user = useAuth((state) => state.user);
  const [showComment, setShowComment] = React.useState(false);
  const router = useRouter();
  const { isMuted, isPlay, pauseVideo, muteVideo, unmuteVideo } =
    useVideoSetting((state) => ({
      isMuted: state.isMuted,
      isPlay: state.isPlay,
      pauseVideo: state.pauseVideo,
      muteVideo: state.muteVideo,
      unmuteVideo: state.unmuteVideo,
    }));

  const isOpen = useCreatePostModal((state) => state.isOpen);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // setIsVisible(entry.isIntersecting);
        console.log(entry.isIntersecting);
        if (entry.isIntersecting && !isOpen) {
          videoRef.current?.play();
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.3 } // Adjust the threshold as needed
    );

    const currentVideoRef = videoRef.current; // Capture the current ref value

    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    // Cleanup the observer when component unmounts
    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, [isOpen]);

  return (
    <Flex
      onClick={() => {
        customCallback && customCallback();
        if (!isSearchMode) return;
        router.push(`/?post_id=${post.id}`);
      }}
      className={`${
        isSearchMode ? 'cursor-pointer' : ''
      } flex-col gap-3 py-3 bg-white  rounded-xl border-2`}
    >
      {/* Top */}
      <Flex className="justify-between items-center px-4">
        <User post={post} />
        {user?.id === post.user.id && <MenuPost post={post} />}
      </Flex>

      {/* File */}
      {post.content_type === 'image' && (
        <Image
          src={post.content_file_url}
          className="object-cover w-full"
          alt=""
        />
      )}

      {post.content_type === 'video' && (
        <video
          muted={isMuted}
          ref={videoRef}
          src={post.content_file_url}
          controls
          loop
        ></video>
      )}
      {/* render caption */}
      {!post.content_file_url && (
        <Caption text={post.caption} caption={caption} />
      )}

      {/* render Actions */}
      <Actions
        post={post}
        toggleComment={() => setShowComment((prev) => !prev)}
      />

      {/* render Caption */}
      {post.content_file_url && (
        <Caption text={post.caption} caption={caption} />
      )}

      {/* render total comments */}
      {post.total_comments != 0 && !showComment && (
        <Text
          className="px-4 cursor-pointer"
          onClick={() => setShowComment(true)}
        >
          see all {post.total_comments} comment
        </Text>
      )}
      {showComment && <Comment post={post} />}
    </Flex>
  );
};

export default Post;
