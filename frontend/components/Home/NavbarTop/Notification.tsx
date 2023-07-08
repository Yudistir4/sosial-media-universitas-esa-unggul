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
  const link = ['polling', 'vote'].includes(notif.activity)
    ? `/?polling_id=${notif.polling_id}`
    : `/?post_id=${notif.post.id}`;
  return (
    <Flex className="relative">
      <Link href={`/?user_id=${notif.from_user.id}`}>
        <Avatar
          size="sm"
          position="absolute"
          className="ml-2   z-10 top-1/2 -translate-y-1/2"
          src={notif.from_user.profile_pic_url}
        />
      </Link>

      <Link href={`/?user_id=${notif.from_user.id}`}>
        <Text
          noOfLines={2}
          className={`absolute   text-sm z-10 mt-2 ml-12 font-semibold ${
            notif.post.content_file_url ? 'mr-14' : 'mr-2'
          } `}
        >
          {notif.from_user.name}
        </Text>
      </Link>
      <Link href={link}>
        <Flex
          className={`${
            notif.is_read ? '' : 'bg-gray-100'
          } p-2 hover:bg-gray-200 gap-2 transition-all justify-between items-center cursor-pointer`}
        >
          <Flex className="gap-2 items-center">
            <div className="w-8 h-8 shrink-0"></div>
            <Flex className="flex-col">
              <Text noOfLines={2} className="text-sm">
                <Text as="span" className="font-semibold opacity-0">
                  {notif.from_user.name}
                </Text>{' '}
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
    </Flex>
  );
};

export default Notification;
