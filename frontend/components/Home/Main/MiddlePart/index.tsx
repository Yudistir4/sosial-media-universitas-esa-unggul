import * as React from 'react';
import Feed from './Feed';
import { Box } from '@chakra-ui/react';
import Profile from './Profile';
import { useRouter } from 'next/router';
interface IMiddlePartProps {}

const MiddlePart: React.FunctionComponent<IMiddlePartProps> = (props) => {
  const router = useRouter();
  const { query } = router;
  const { user_id, post_category, saved } = query;

  return (
    <Box width={{ sm: '100%', lg: '75%', xl: '50%' }} className="">
      {user_id ? (
        <Profile />
      ) : (
        <Feed post_category={post_category as string} saved={!!saved} />
      )}
    </Box>
  );
};

export default MiddlePart;
