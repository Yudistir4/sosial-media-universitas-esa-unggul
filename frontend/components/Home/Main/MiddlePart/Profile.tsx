import * as React from 'react';
import {
  Box,
  Flex,
  Avatar,
  Text,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  return (
    <Flex className="flex-col items-center bg-white gap-2">
      <Avatar size="2xl" />
      <Text as="b">Universitas Esa Unggul</Text>
      <Text>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Exercitationem, architecto.
      </Text>
      <Tabs className="w-full">
        <TabList className="font-[600]  overflow-auto">
          <Tab>Postingan</Tab>
          <Tab className="shrink-0">Faculty & Program Study</Tab>
          <Tab>Organizations</Tab>
          <Tab>Students</Tab>
          <Tab>Students</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
          <TabPanel>
            <p>wkwk!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Profile;
