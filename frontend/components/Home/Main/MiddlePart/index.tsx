import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import Feed from './Feed';
import Profile from './Profile';
import SinglePost from './SinglePost';
interface IMiddlePartProps {}

const MiddlePart: React.FunctionComponent<IMiddlePartProps> = (props) => {
  const router = useRouter();
  const { query } = router;
  const { user_id, post_category, saved, post_id } = query;

  return (
    <Box width={{ sm: '100%', lg: '75%', xl: '50%' }} className="">
      {post_id && <SinglePost post_id={post_id as string} />}
      {user_id && <Profile />}
      {!user_id && !post_id && (
        <Feed
          post_category={post_category as string}
          saved={!!saved}
          showRecipient={true}
        />
      )}
    </Box>
  );
};

export default MiddlePart;
