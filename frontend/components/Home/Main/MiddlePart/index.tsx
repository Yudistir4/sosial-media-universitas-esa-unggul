import * as React from 'react';
import Feed from './Feed';
import { Box } from '@chakra-ui/react';
import Profile from './Profile';
import { useRouter } from 'next/router';
interface IMiddlePartProps {}

const MiddlePart: React.FunctionComponent<IMiddlePartProps> = (props) => {
  const router = useRouter();
  const { query } = router;
  const userID = query.user_id;
  return (
    <Box width={{ sm: '100%', lg: '75%', xl: '50%' }} className="">
      {userID ? <Profile /> : <Feed />}
    </Box>
  );
};

export default MiddlePart;
