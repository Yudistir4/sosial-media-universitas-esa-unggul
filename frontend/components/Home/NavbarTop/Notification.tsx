import { NotificationDoc } from '@/typing';
import { Avatar, Flex, Image, Text } from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import * as React from 'react';

interface INotificationProps {
  notification: NotificationDoc;
}

const Notification: React.FunctionComponent<INotificationProps> = ({
  notification: notif,
}) => {
  return (
    <Link href={`/?post_id=${notif.post.id}`}>
      <Flex
        className={`${
          notif.is_read ? '' : 'bg-gray-100'
        } p-2 hover:bg-gray-200 gap-2 transition-all justify-between items-center cursor-pointer`}
      >
        <Flex className="gap-2 items-center">
          <Link href={`/?user_id=${notif.from_user.id}`}>
            <Avatar size="sm" src={notif.from_user.profile_pic_url} />
          </Link>
          <Flex className="flex-col">
            <Text noOfLines={2} className="text-sm">
              <Link
                as="span"
                href={`/?user_id=${notif.from_user.id}`}
                className="font-semibold"
              >
                {notif.from_user.name}
              </Link>{' '}
              {notif.message}
            </Text>
            <Text className="text-xs font-light">
              {moment(notif.created_at).fromNow()}
            </Text>
          </Flex>
        </Flex>
        {notif.post.content_type === 'image' && (
          <Image
            src={notif.post.content_file_url}
            className="aspect-square object-cover w-10 "
            alt="random"
          />
        )}
        {notif.post.content_type === 'video' && (
          <video
            muted={true}
            src={notif.post.content_file_url}
            className="aspect-square object-cover w-10  "
          ></video>
        )}
      </Flex>
    </Link>
  );
};

export default Notification;
