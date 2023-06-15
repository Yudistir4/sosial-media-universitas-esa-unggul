import { Text } from '@chakra-ui/react';
import * as React from 'react';

interface ICaptionProps {
  text: string;
}

const Caption: React.FunctionComponent<ICaptionProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const isTextLong = text.length > 100 ? true : false;
  const truncatedText = isExpanded ? text : `${text.slice(0, 100)}`;
  return (
    <Text className="whitespace-pre-line px-4  ">
      {truncatedText}

      {!isExpanded && isTextLong && (
        <Text
          color="blackAlpha.800"
          className="cursor-pointer inline font-semibold"
          onClick={toggleExpand}
        >
          ...selengkapnya
        </Text>
      )}
    </Text>
  );
};

export default Caption;
