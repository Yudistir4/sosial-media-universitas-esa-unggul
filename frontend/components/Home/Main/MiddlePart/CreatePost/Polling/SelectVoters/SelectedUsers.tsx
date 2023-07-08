// import { useSelectVoters } from '@/store/selectVoters';
import { UserLittle2 } from '@/typing';
import { Avatar, Flex, IconButton, Text } from '@chakra-ui/react';
import * as React from 'react';
import { MdOutlineDelete } from 'react-icons/md';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

interface ISelectedUsersProps {
  selectedUsers: UserLittle2[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<UserLittle2[]>>;
}

const SelectedUsers: React.FunctionComponent<ISelectedUsersProps> = ({
  selectedUsers,
  setSelectedUsers,
}) => {
  const [search, setSearch] = React.useState('');

  const Column = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <Flex className="  flex-col gap-1   max-w-[48px]">
        <div className="relative">
          <Avatar />

          <IconButton
            onClick={() => {
              const element = document.getElementById(selectedUsers[index].id);
              if (element) {
                element.click();
              }
              setSelectedUsers((prev) =>
                prev.filter((old) => old.id !== selectedUsers[index].id)
              );
            }}
            borderRadius="full"
            colorScheme="red"
            className="-right-1 -bottom-1"
            position="absolute"
            size="xs"
            aria-label="input file"
            icon={<MdOutlineDelete className="text-sm" />}
          />
        </div>
        <Text className="text-xs text-center" noOfLines={1}>
          {selectedUsers[index].name}
        </Text>
      </Flex>
    </div>
  );

  // console.log(selec);
  return (
    <>
      {selectedUsers.length > 0 && (
        <div className="h-28 w-[calc(100%-0)] max-w-[calc(100%-0)]">
          <>
            <AutoSizer className="w-[calc(100%-0)] h-10 p-2">
              {({ height, width }) => (
                <List
                  height={height}
                  itemCount={selectedUsers.length}
                  itemSize={60}
                  layout="horizontal"
                  width={width}
                >
                  {Column}
                </List>
              )}
            </AutoSizer>
            <div className="mb-16 w-full"></div>
          </>
        </div>
      )}
    </>
  );
};

export default SelectedUsers;
