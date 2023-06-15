import { User } from '@/typing';
import { Flex, IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import * as React from 'react';
import {
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineMail,
  AiOutlineWhatsApp,
} from 'react-icons/ai';
import { HiOutlineExternalLink } from 'react-icons/hi';

interface IContactProps {
  user: User;
}

const Contact: React.FunctionComponent<IContactProps> = ({ user }) => {
  return (
    <Flex className="gap-2">
      {user.eksternal_link && (
        <Link href={user.eksternal_link}>
          <IconButton
            borderRadius={999}
            colorScheme="teal"
            aria-label="link"
            icon={<HiOutlineExternalLink className="text-xl" />}
          />
        </Link>
      )}
      {user.instagram && (
        <Link href={`https://www.instagram.com/${user.instagram}`}>
          <IconButton
            borderRadius={999}
            colorScheme="facebook"
            aria-label="instagram"
            icon={<AiOutlineInstagram className="text-xl" />}
          />
        </Link>
      )}
      {user.linkedin && (
        <Link href={user.linkedin}>
          <IconButton
            borderRadius={999}
            colorScheme="linkedin"
            aria-label="linkedin"
            icon={<AiOutlineLinkedin className="text-xl" />}
          />
        </Link>
      )}
      {user.email && (
        <Link href={'mailto:' + user.email}>
          <IconButton
            borderRadius={999}
            colorScheme="gray"
            aria-label="email"
            icon={<AiOutlineMail className="text-xl" />}
          />
        </Link>
      )}
      {user.whatsapp && (
        <Link href={`https://wa.me/62${user.whatsapp}`}>
          <IconButton
            borderRadius={999}
            colorScheme="whatsapp"
            aria-label="whatsapp"
            icon={<AiOutlineWhatsApp className="text-xl" />}
          />
        </Link>
      )}
    </Flex>
  );
};

export default Contact;
